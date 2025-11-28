"use client"
import Link from "next/link";
import { useWeb3 } from "@/hook/useWeb3";

export default function WalletConnection() {
  
   const {account,connectWallet,isConnected} = useWeb3()

    
  return (
    <>

      {!isConnected ? (
        <div className="flex flex-col justify-center bg-slate-200 h-screen items-center">
          <button
            type="button"
            onClick={connectWallet}
            className="text-white bg-pink-500 rounded-full p-3 font-serif hover:bg-pink-700 hover:cursor-pointer"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen bg-slate-200">
          <Link href="/swap" className="border p-6 rounded-lg hover:shadow-lg transition mb-5 w-100 bg-slate-500 hover:bg-slate-900">
            <h2 className="text-xl font-semibold mb-2">Swap Tokens</h2>
            <p>Exchange TLR for BRP and vice versa</p>
          </Link>
          
          <Link href="/liquidity" className="border p-6 rounded-lg hover:shadow-lg transition w-100  bg-slate-500 hover:bg-slate-900">
            <h2 className="text-xl font-semibold mb-2">Provide Liquidity</h2>
            <p>Add tokens to the pool</p>
          </Link>
        </div>
      )}
    </>
  );
}
