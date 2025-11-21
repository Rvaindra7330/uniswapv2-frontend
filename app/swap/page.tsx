"use client"

import { useWeb3 } from "@/hook/useWeb3"

export default function Swap(){
    const { isConnected,connectWallet} =useWeb3()
    return <div className="flex flex-col justify-center items-center h-screen bg-slate-500">
    <input type="text" placeholder="sell" />
    <input type="text" placeholder="buy" />
    <button onClick={!isConnected?connectWallet:()=>{}}>{isConnected?"swap":"connect"}</button>
    </div>
}