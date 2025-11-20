"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function walletConnection(){
    const [isConnected,setIsConnected] = useState(false)
    const [account,setAccount] = useState<String>("")
    const router = useRouter()
    async function connectWallet(){
             const provider = new ethers.BrowserProvider((window as any).ethereum);
             const signer = await provider.getSigner();
             const accountAddr = await signer.getAddress();
             setAccount(accountAddr)
             setIsConnected(true)
             
    }
    useEffect(()=>{
        if((window as any).ethereum){
            connectWallet()
        }

    },[account])
    return <>{isConnected ? (<div>Account is connected {account}</div>) :
    (<div className="flex flex-col justify-center bg-slate-500  h-screen items-center">
       <button type="button" onClick={connectWallet} className="text-white bg-blue-500 rounded-full p-3 font-serif  hover:bg-blue-700 hover:cursor-pointer">connect wallet</button>
    </div>)}</>
}