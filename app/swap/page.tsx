"use client"

import { useWeb3 } from "@/hook/useWeb3"

export default function Swap(){
    const { isConnected,connectWallet} =useWeb3()
    return <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <h1 className="text-4xl font-bold font-serif mb-6 mt-2">Swap anytime,<br></br>anywhere.</h1>
    <input type="text" placeholder="enter the token to swap(TLR/BRP)" className="p-5 mb-2 w-100  border border-default-medium rounded-full focus:ring-brand focus:border-brand" />
    <input type="text" placeholder="" className="p-5 mb-2 w-100 rounded-full  border border-default-medium focus:ring-brand focus:border-brand" />
    <button  className="text-white font-bold bg-pink-500 rounded-full p-3 font-serif hover:bg-pink-700 hover:cursor-pointer w-100" onClick={!isConnected?connectWallet:()=>{}}>{isConnected?"swap":"connect"}</button>
    </div>
}