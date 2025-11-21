"use client"
import Link from "next/link";
import { useWeb3 } from "@/hook/useWeb3";

export default function WalletConnection() {
  
   const {account,connectWallet} = useWeb3()

    
  return (
    <>

      {!account ? (
        <div className="flex flex-col justify-center bg-slate-500 h-screen items-center">
          <button
            type="button"
            onClick={connectWallet}
            className="text-white bg-blue-500 rounded-full p-3 font-serif hover:bg-blue-700 hover:cursor-pointer"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/swap" className="border p-6 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">💱 Swap Tokens</h2>
            <p>Exchange TLR for BRP and vice versa</p>
          </Link>
          
          <Link href="/liquidity" className="border p-6 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">💧 Provide Liquidity</h2>
            <p>Add tokens to the pool and earn fees</p>
          </Link>
        </div>
      )}
    </>
  );
}
