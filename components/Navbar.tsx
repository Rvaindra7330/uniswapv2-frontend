"use client";

import Link from "next/link";
import { useWeb3 } from "@/hook/useWeb3";

export default function Navbar() {
  const { account, isConnected,connectWallet } = useWeb3();

  return (
    <nav className="border-b-0 shadow-xl p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold text-pink-500 font-serif">Uniswap Clone</h1>
        <div className="space-x-4">
          <Link href="/" className="hover: text-gray-500">Home</Link>
          <Link href="/swap" className="hover: text-gray-500">Swap</Link>
          <Link href="/liquidity" className="hover: text-gray-500">Liquidity</Link>

          <span className="text-gray-500">{isConnected?`Account : ${account}`:(
    <button
            type="button"
            onClick={connectWallet}
            className="text-white bg-pink-500 rounded-full p-3 font-serif hover:bg-pink-700 hover:cursor-pointer"
          >
            Connect Wallet
          </button>
  )}</span>
        </div>
      </div>
    </nav>
  );
}
