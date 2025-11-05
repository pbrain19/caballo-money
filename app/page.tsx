"use client"

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Zap, Bot } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const assets = [
    { name: "Bitcoin", color: "text-orange-500" },
    { name: "Tesla Stock", color: "text-red-500" },
    { name: "Gold", color: "text-yellow-500" },
    { name: "Ethereum", color: "text-purple-500" },
    { name: "Apple Stock", color: "text-gray-700 dark:text-gray-300" },
  ];

  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAssetIndex((prev) => (prev + 1) % assets.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [assets.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Caballo AI"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <Button variant="outline" size="sm">Sign In</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Earnings Platform</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 min-h-[120px] md:min-h-[140px] flex items-center justify-center">
            <span className="inline-block">
              Generate More{" "}
              <span 
                key={currentAssetIndex}
                className={`inline-block ${assets[currentAssetIndex].color} animate-fade-in`}
              >
                {assets[currentAssetIndex].name}
              </span>
              <br />
              With Your {assets[currentAssetIndex].name}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl">
            We put your assets to work so they can make more with DeFi. Earn while you sleep, automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="text-base font-semibold px-8 py-6 bg-amber-500 hover:bg-amber-600 text-white">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6 border-amber-500 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-600 dark:hover:bg-amber-950/30">
              Learn More
            </Button>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-8">
            How Caballo Works
          </h2>
          
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {/* Slide 1: Deposit */}
              <CarouselItem>
                <div className="p-6 md:p-8">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-2xl p-8 md:p-12 text-white min-h-[400px] flex flex-col justify-center">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <span className="text-3xl font-bold">1</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Deposit Your Assets</h3>
                    <p className="text-lg md:text-xl text-amber-50 leading-relaxed">
                      Drop in your tokens or stocks - that's it! They stay yours, and you can withdraw anytime. Simple as depositing money in a bank.
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 2: AI Analysis */}
              <CarouselItem>
                <div className="p-6 md:p-8">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 rounded-2xl p-8 md:p-12 text-white min-h-[400px] flex flex-col justify-center">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <Bot className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">AI Finds the Best Strategies</h3>
                    <p className="text-lg md:text-xl text-indigo-50 leading-relaxed mb-4">
                      Our AI analyzes thousands of liquidity pools 24/7, looking for:
                    </p>
                    <ul className="space-y-2 text-indigo-50">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-200 mt-1">•</span>
                        <span>The best liquidity pools with high volume</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-200 mt-1">•</span>
                        <span>Smart hedging strategies to protect your assets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-200 mt-1">•</span>
                        <span>Optimal positions using leverage when needed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 3: Auto Monitor */}
              <CarouselItem>
                <div className="p-6 md:p-8">
                  <div className="bg-gradient-to-br from-amber-500 to-yellow-600 dark:from-amber-600 dark:to-yellow-700 rounded-2xl p-8 md:p-12 text-white min-h-[400px] flex flex-col justify-center">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">We Watch & Optimize 24/7</h3>
                    <p className="text-lg md:text-xl text-amber-50 leading-relaxed">
                      Think of us as your personal currency exchange agent - always watching prices, always moving your assets to where they earn the most. You don't lift a finger.
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 4: Voice Agent */}
              <CarouselItem>
                <div className="p-6 md:p-8">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800 rounded-2xl p-8 md:p-12 text-white min-h-[400px] flex flex-col justify-center">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Talk to Your Money Manager</h3>
                    <p className="text-lg md:text-xl text-indigo-50 leading-relaxed">
                      Just talk to Caballo like you would a financial advisor. Ask questions, check your earnings, or make changes - all by voice. No confusing dashboards or buttons.
                    </p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            
            <div className="flex items-center justify-center gap-4 mt-8">
              <CarouselPrevious className="relative left-0 translate-y-0" />
              <CarouselNext className="relative right-0 translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* Problem/Solution Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-4">Doing It Yourself</h3>
            <ul className="space-y-3 text-red-800 dark:text-red-400">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Watching prices all day and night</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Missing the best earning opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Confusing platforms and complicated tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Your money sitting idle when it could earn more</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-300 mb-4">With Caballo</h3>
            <ul className="space-y-3 text-amber-800 dark:text-amber-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Earn from liquidity pools and smart hedging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Your money works while you sleep</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Always in the best earning positions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Just talk to manage everything</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-600 dark:to-yellow-700 rounded-3xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Money Could Be Earning More Right Now
          </h2>
          <p className="text-lg md:text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Join thousands earning extra income from their tokens and stocks - all on autopilot.
          </p>
          <Button size="lg" className="text-base font-semibold px-8 py-6 bg-white text-amber-600 hover:bg-gray-100">
            Start Earning Today
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>&copy; 2025 Caballo. Making your money work smarter.</p>
        </div>
      </footer>
    </div>
  );
}
