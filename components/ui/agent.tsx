"use client";

import { useState, useEffect, useRef } from "react";
import { useActiveWallet, useWalletBalance } from "thirdweb/react";
import { RealtimeAgent, tool } from "@openai/agents/realtime";
import { useAgentContext } from "@/app/context/AgentContext";
import { useRealtimeSession } from "@/app/hooks/useRealtimeSession";
import { arcChain, client } from "@/lib/thirdwebClient";
import { Orb } from "./Orb";
import z from "zod";

type AgentProps = {
  openAIEphemeralKey: string;
};

const USDC_TOKEN_ADDRESS = "0x3600000000000000000000000000000000000000";

export default function Agent({ openAIEphemeralKey }: AgentProps) {
  const wallet = useActiveWallet();
  const { setInvestedBalance } = useAgentContext();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check USDC token balance specifically
  const { data: balance, refetch: refetchBalance } = useWalletBalance({
    chain: arcChain,
    address: wallet?.getAccount()?.address,
    client,
    tokenAddress: USDC_TOKEN_ADDRESS, // Important: Check USDC token, not native token
  });

  const { connect, disconnect, sendUserText, mute } = useRealtimeSession();

  const [showAddress, setShowAddress] = useState(false);
  const [depositDetected, setDepositDetected] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPosition, setShowPosition] = useState(false);
  const [earnedUsdc, setEarnedUsdc] = useState(0.1);
  const [earnedEth, setEarnedEth] = useState(0.002);
  const [lastCheckedBalance, setLastCheckedBalance] = useState<string>("0");
  const [agentSilenced, setAgentSilenced] = useState(false);
  const initialBalanceRef = useRef<bigint | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingCountRef = useRef<number>(0);

  const agent = useRef(
    new RealtimeAgent({
      name: "Crypto Advisor",
      instructions: `You are an expert specialized in liquidity pools on EVM chains, and you are solely focused on the Arc network. 
    
    Always greet the user with the message: 'Welcome to Caballo, your personal Crypto Advisor, tell me, how can I assist you today?'
  
    Your job is to educate the user in understanding liquidity pools as you collect information.
    
    The first message collects their name and use their name often as you speak to them.
    
    Then we explain a bit about liquidity pools and see if they have further questions about it. Explain it like they aren not financial savvy and with examples that are relatable (i like to say that LPs work similar to currency exchange people in the corner when u travel abroad).
    
    Once the user understands or has no further questions lets collect their risk profile (high,medium,low). Lets explain briefly each so that user can make informed decision.
    
    After collecting the risk profile, you will explain which pools match their profile, then tell them their deposit address will appear on screen and they should send USDC there to get started. Keep this final message friendly and reassuring.`,
      tools: [
        tool({
          name: "get_riskprofile",
          description:
            "Detect and return the user's risk tolerance level as high, medium, or low.",
          strict: true,
          parameters: z.object({
            riskTolerance: z.object({
              type: z.enum(["high", "medium", "low"]),
              description: z.string({
                description: "The user's risk tolerance level",
              }),
            }),
          }),
          async execute({ riskTolerance }) {
            console.log("🎯 Risk profile collected:", riskTolerance);

            // Trigger agent to give final message about pools and deposit address
            sendUserText(
              "Now explain which pools match my risk profile and tell me my deposit address will appear on screen where I should send USDC to get started"
            );

            // Wait for agent to finish speaking (~5 seconds), then show address and silence
            setTimeout(async () => {
              console.log("💳 Showing deposit address");

              // CRITICAL: Capture current balance NOW before showing address
              const currentResult = await refetchBalance();
              const currentBalance = currentResult.data?.value || BigInt(0);
              initialBalanceRef.current = currentBalance;
              console.log(
                "📸 Snapshot taken - Initial balance:",
                currentResult.data?.displayValue,
                "(",
                currentBalance.toString(),
                ")"
              );

              setShowAddress(true);

              // Give it another moment, then gracefully silence the agent
              setTimeout(() => {
                console.log(
                  "🔇 Muting agent - entering silent mode for deposit"
                );
                mute(true); // Mute the microphone input
                setAgentSilenced(true);
              }, 2000);
            }, 5000);
          },
        }),
      ],
    })
  );

  const [volume, setVolume] = useState(0);
  const animationRef = useRef<number>(0);

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (wallet?.getAccount()?.address) {
      navigator.clipboard.writeText(wallet.getAccount()!.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // Manual balance check function
  const manualCheckBalance = async () => {
    console.log("🔍 Manual balance check triggered");
    try {
      const result = await refetchBalance();
      const currentBalance = result.data?.value || BigInt(0);
      const displayValue = result.data?.displayValue || "0";

      console.log("📊 Current USDC Balance:", displayValue);
      console.log("📊 Raw Balance:", currentBalance.toString());
      console.log(
        "📊 Initial Balance:",
        initialBalanceRef.current?.toString() || "not set"
      );

      setLastCheckedBalance(displayValue);

      if (
        currentBalance &&
        initialBalanceRef.current !== null &&
        currentBalance > initialBalanceRef.current
      ) {
        console.log("✅ DEPOSIT DETECTED! Triggering success flow...");
        setDepositDetected(true);
        setShowAddress(false);
        setAgentSilenced(false); // Reactivate orb visuals

        const audio = new Audio("/deposit-confirmation.mp3");
        audio.volume = 1.0;
        audio
          .play()
          .then(() => console.log("🔊 Playing deposit confirmation audio"))
          .catch((err) => console.log("Audio playback failed:", err));

        setInvestedBalance(200);

        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      } else {
        console.log("⏳ No deposit detected yet");
      }
    } catch (error) {
      console.error("❌ Error checking balance:", error);
    }
  };

  // Balance polling logic - starts when address is shown
  useEffect(() => {
    if (!showAddress || depositDetected || !wallet) {
      console.log("⚠️ Polling conditions not met:", {
        showAddress,
        depositDetected,
        hasWallet: !!wallet,
      });
      return;
    }

    // Initial balance should already be set by the tool execution
    // But as a fallback, set it here if somehow it's not set
    if (initialBalanceRef.current === null) {
      console.warn("⚠️ Initial balance not set! Setting it now as fallback...");
      if (balance?.value !== undefined) {
        initialBalanceRef.current = balance.value;
        console.log(
          "📍 Fallback: Initial USDC balance set:",
          balance.displayValue,
          "(" + balance.value.toString() + ")"
        );
      }
    }

    console.log("🚀 Starting USDC balance polling every 2 seconds...");
    console.log(
      "📊 Will compare against initial balance:",
      initialBalanceRef.current?.toString()
    );
    pollingCountRef.current = 0;

    // Start polling every 2 seconds (changed from 3)
    pollingIntervalRef.current = setInterval(async () => {
      pollingCountRef.current++;
      console.log(
        `🔄 Poll #${pollingCountRef.current} - Checking USDC balance...`
      );

      try {
        const result = await refetchBalance();
        const newBalance = result.data?.value;
        const displayValue = result.data?.displayValue;

        console.log(`  Current: ${displayValue} (${newBalance?.toString()})`);
        console.log(`  Initial: ${initialBalanceRef.current?.toString()}`);
        console.log(
          `  Comparison: ${newBalance?.toString()} > ${initialBalanceRef.current?.toString()} = ${
            newBalance && initialBalanceRef.current !== null
              ? newBalance > initialBalanceRef.current
              : false
          }`
        );

        if (
          newBalance &&
          initialBalanceRef.current !== null &&
          newBalance > initialBalanceRef.current
        ) {
          console.log("🎉 DEPOSIT DETECTED!");
          console.log(
            `  Increase: ${(newBalance - initialBalanceRef.current).toString()}`
          );

          // Deposit detected!
          setDepositDetected(true);
          setShowAddress(false);
          setAgentSilenced(false); // Reactivate orb visuals

          // Play confirmation audio using separate Audio element (not agent audio)
          const audio = new Audio("/deposit-confirmation.mp3");
          audio.volume = 1.0;
          audio
            .play()
            .then(() => console.log("🔊 Playing deposit confirmation audio"))
            .catch((err) => console.log("Audio playback failed:", err));

          // Update invested balance
          setInvestedBalance(200);

          // Clear polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            console.log("⏹️ Polling stopped");
          }
        } else {
          console.log("  ⏳ No change detected");
        }
      } catch (error) {
        console.error("❌ Error polling balance:", error);
      }
    }, 2000); // Changed to 2 seconds

    // Cleanup on unmount or when conditions change
    return () => {
      if (pollingIntervalRef.current) {
        console.log("🧹 Cleaning up polling interval");
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [
    showAddress,
    depositDetected,
    wallet,
    balance,
    refetchBalance,
    setInvestedBalance,
  ]);

  // Progressive steps animation after deposit is detected
  useEffect(() => {
    if (!depositDetected) return;

    const steps = [
      "Great — I see you've finished depositing!",
      "Now, let me scan across DeFi networks to find the pools offering the best yields. I determine this by checking how full each pool is and how much trading volume is flowing through it.",
      "Alright, I've found one that matches your risk profile — we'll be depositing into a USDC–ETH pool on the Base network.",
      "First, I'll use Circle's CCTP to securely transfer your USDC across chains. CCTP is a trusted protocol built by Circle to move USDC between networks safely.",
      "Okay, funds received! Now I'm swapping your tokens into USDC and ETH. Liquidity pools require both assets in equal proportion, so I'm making sure everything lines up perfectly.",
      "Next, I'm minting your deposit token — think of it as a digital receipt that represents your position and can be redeemed or transferred anytime.",
      "And… done! Your position is live and already earning yield in ETH and USDC on Base.",
      "From here, I'll keep monitoring the markets. If prices swing or a better pool appears, I'll automatically rebalance your position for optimal returns. You're all set — sit back and let me handle the rest. Have a great day!",
    ];

    let stepIndex = 0;
    setCurrentStep(0);

    const intervalId = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      } else {
        clearInterval(intervalId);
        // Show position preview after all steps are done
        setTimeout(() => {
          setShowPosition(true);
        }, 1000);
      }
    }, 3000); // 3 seconds between steps

    return () => clearInterval(intervalId);
  }, [depositDetected]);

  // Increment earnings every second for demo effect
  useEffect(() => {
    if (!showPosition) return;

    const intervalId = setInterval(() => {
      setEarnedUsdc((prev) => prev + 0.0001); // Small increment
      setEarnedEth((prev) => prev + 0.000002); // Proportional small increment
    }, 1000); // Every second

    return () => clearInterval(intervalId);
  }, [showPosition]);

  useEffect(() => {
    connect({
      getEphemeralKey: async () => openAIEphemeralKey,
      initialAgents: [agent.current],
      audioElement: audioRef.current!,
    });
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const boosted = Math.min(rms * 3.5, 1); // multiply by 3.5 for stronger motion
      const smoothingFactor = 0.25;
      smoothedVolume =
        smoothedVolume + (boosted - smoothedVolume) * smoothingFactor;
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

  const progressSteps = [
    "Great — I see you've finished depositing!",
    "Now, let me scan across DeFi networks to find the pools offering the best yields. I determine this by checking how full each pool is and how much trading volume is flowing through it.",
    "Alright, I've found one that matches your risk profile — we'll be depositing into a USDC–ETH pool on the Base network.",
    "First, I'll use Circle's CCTP to securely transfer your USDC across chains. CCTP is a trusted protocol built by Circle to move USDC between networks safely.",
    "Okay, funds received! Now I'm swapping your tokens into USDC and ETH. Liquidity pools require both assets in equal proportion, so I'm making sure everything lines up perfectly.",
    "Next, I'm minting your deposit token — think of it as a digital receipt that represents your position and can be redeemed or transferred anytime.",
    "And… done! Your position is live and already earning yield in ETH and USDC on Base.",
    "From here, I'll keep monitoring the markets. If prices swing or a better pool appears, I'll automatically rebalance your position for optimal returns. You're all set — sit back and let me handle the rest. Have a great day!",
  ];

  return (
    <div className="flex-1 flex flex-col items-center relative">
      {wallet ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          {/* LP Position Preview - Above Orb */}
          {showPosition && (
            <div className="absolute top-20 z-10 transition-all duration-500 ease-in-out">
              <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-8">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                      Your Position
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        USDC/ETH
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                        5.00 / 0.04
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-zinc-300 dark:bg-zinc-700"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                      Earned
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {earnedUsdc.toFixed(4)} USDC
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {earnedEth.toFixed(6)} ETH
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orb - always visible */}
          <div className="flex-1 w-full relative">
            <audio className="hidden" ref={audioRef}></audio>
            <Orb
              volumeMode="manual"
              manualOutput={agentSilenced ? 0.1 : volume}
              colors={
                agentSilenced ? ["#9CA3AF", "#D1D5DB"] : ["#FF6B6B", "#FFD93D"]
              }
              seed={789}
            />
            {agentSilenced && !depositDetected && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  💤 Waiting for your deposit...
                </p>
              </div>
            )}
          </div>

          {/* Address Display Card */}
          {showAddress && !depositDetected && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 max-w-md border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-right duration-500">
              <div className="space-y-4">
                {agentSilenced && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
                    <span>Agent listening paused - awaiting your deposit</span>
                  </div>
                )}
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  Deposit Address
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Send USDC to this address to get started
                </p>
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 break-all font-mono text-sm">
                  {wallet.getAccount()?.address}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {copiedAddress ? "✓ Copied!" : "Copy Address"}
                </button>

                {/* Manual Check Button for Testing */}
                <button
                  onClick={manualCheckBalance}
                  className="w-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                >
                  🔍 Manual Check Balance
                </button>

                {lastCheckedBalance !== "0" && (
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 text-center bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
                    Last checked: {lastCheckedBalance} USDC
                  </div>
                )}

                <div className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
                  Auto-checking every 2 seconds...
                  <div className="flex justify-center mt-2 space-x-1">
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progressive Steps Display */}
          {depositDetected && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 max-w-xl border border-zinc-200 dark:border-zinc-800">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="text-green-500">✓</span> Processing Your
                  Investment
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {progressSteps
                    .slice(0, currentStep + 1)
                    .map((step, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 p-4 rounded-lg transition-all duration-500 ${
                          index === currentStep
                            ? "bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-l-4 border-orange-500"
                            : "bg-zinc-50 dark:bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {index < currentStep ? (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          ) : index === currentStep ? (
                            <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                            </div>
                          ) : null}
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <h1 className="my-auto text-4xl font-medium text-center text-zinc-900 dark:text-white">
          Connect your wallet first
        </h1>
      )}
    </div>
  );
}
