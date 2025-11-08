"use client";

import { useState, useEffect } from "react";
import { useDisconnect, useActiveWallet } from "thirdweb/react";
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";
import { useAgentContext } from '@/app/context/AgentContext';

type AgentProps = {
  openAIEphemeralKey: string
}

export default function Agent({ openAIEphemeralKey }: AgentProps) {
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();
  const { setInvestedBalance } = useAgentContext();

  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      const agent = new RealtimeAgent({
        name: 'Crypto Advisor',
        instructions: `You are an expert specialized in liquidity pools on EVM chains, and you are solely focused on the Arc network. 
        
        Always greet the user with the message: 'Welcome to Caballo, your personal Crypto Advisor, tell me, how can I assist you today?'

        Your job is to educate the user in understanding liquidity pools as you collect information.
        
        The first message collects their name and use their name often as you speak to them.
        
        Then we explain a bit about liquidity pools and see if they have further questions about it. Explain it like they aren not financial savvy and with examples that are relatable (i like to say that LPs work similar to currency exchange people in the corner when u travel abroad).
        
        Once the user understands or has no further questions lets collect their risk profile (high,medium,low). Lets explain briefly each so that user can make informed decision.
        
        Lastly after we have risk profile ask user to deposit to address seen on screen.`,
      });
      const session = new RealtimeSession(agent, {
        model: 'gpt-realtime',
      });
      try {
        await session.connect({
          apiKey: openAIEphemeralKey,
        });
        console.log('You are connected!');
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  // const conversation = useConversation({
  //   onMessage: ({ message, source }) => {
  //     console.log(message);
  //     setMessages((prev: any) => [...prev, { role: source === 'ai' ? 'agent' : 'user', text: message }]);
  //   },

  // });

  // const sendMessage = (text: string) => {
  //   conversation.sendUserMessage(text);
  // };
  
  // const handleSignOut = () => {
  //   if (wallet) {
  //     disconnect(wallet)
  //   }
  // }

  // useEffect(() => {
  //   const startChat = async () => {
  //     await conversation.startSession({
  //       agentId: process.env.NEXT_PUBLIC_ELEVEN_LABS_AGENT_ID as any, // 🧠 your ElevenLabs agent
  //       connectionType: "webrtc", // Voice + text
  //     });
  //   };
  //   startChat();
  //   console.log(openAIEphemeralKey);
  // }, []);

  return (
    <div className="flex-1 flex flex-col items-center">
      {wallet ? (
        <div className="w-full h-full flex">
          <div className="flex-1"></div>
          <div className="flex-1 flex flex-col p-4 border rounded-2xl shadow-lg bg-white">
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
          </div>
        </div>
      ) : (
        <h1 className="my-auto text-4xl font-medium text-center">Connect your wallet first</h1>
      )}
    </div>
  )
}