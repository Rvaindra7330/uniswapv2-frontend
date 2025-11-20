"use client"
import { ethers } from "ethers";
export default function walletConnection(){
    async function connectWallet(){
        if(window.ethereum){
             const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
        }
    }
    return <div className="flex flex-col justify-center bg-slate-500  h-screen items-center">
       <button type="button" onClick={connectWallet} className="text-white bg-blue-500 rounded-full p-3 font-serif  hover:bg-blue-700 hover:cursor-pointer">connect wallet</button>
    </div>
}