"use client"

import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton } from 'thirdweb/react';
import { inAppWallet } from 'thirdweb/wallets';
import { arcChain, client } from '@/lib/thirdwebClient';
import { useAgentContext } from '@/app/context/AgentContext';

export default function Header() {
  const { investedBalance } = useAgentContext();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Caballo AI"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </Link>
      <div className="flex items-center text-xl text-[#c19d29] font-semibold">Invested balance: {investedBalance} USDC</div>
      <div className="flex gap-6">
        <ConnectButton
          client={client}
          chain={arcChain}
          wallets={[
            inAppWallet({
              auth: {
                options: ["google"],
              },
            }),
          ]}
          theme="light"
        />
      </div>
    </div>
  </header>
  );
}