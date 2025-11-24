"use client"

import { useWeb3 } from "@/hook/useWeb3"
import { CONTRACT_ADDRESSES, TOKEN_DECIMALS } from "@/lib/constants"
import { useEffect, useState } from "react"
import  {ethers} from 'ethers'
import { ERC20_ABI, FACTORY_ABI, PAIR_ABI } from "@/lib/abi"
import { toast, ToastContainer } from "react-toastify"

export default function Swap(){
    const { isConnected,connectWallet,signer} =useWeb3()
     const [fromToken,setFromToken]=useState(CONTRACT_ADDRESSES.tokenA)
     const [toToken,setToToken] = useState(CONTRACT_ADDRESSES.tokenB)
    const [amountIn, setAmountIn] = useState<string>("");
    const [amountInWei, setAmountInWei] = useState<bigint>(0n);
     const [amountOut,setAmountOut]= useState('')
     const [pairAddress,setPairAddress]=useState('')
     const [isSwapping,setIsSwapping]=useState(false)
     const [fromAmount,setFromAmount]=useState('')
     const [toAmount, setToAmount] = useState('');
     


     useEffect(()=>{
        if(signer) findPairAddress()
     },[signer])
    
     const findPairAddress = async()=>{
        const factory = new ethers.Contract(CONTRACT_ADDRESSES.factory,FACTORY_ABI,signer)
        const pair = await factory.getPair(CONTRACT_ADDRESSES.tokenA,CONTRACT_ADDRESSES.tokenB)
        setPairAddress(pair)
        console.log('pair',pair)
     }

     const calculateOutput = async (amountIn:string)=>{
        if(!pairAddress || !amountIn || amountIn.trim()==='') return;
        const inputAmount = ethers.parseUnits(amountIn,TOKEN_DECIMALS)
        setAmountInWei(inputAmount)

        const pair= new ethers.Contract(pairAddress,PAIR_ABI,signer)
        const [reserveA,reserveB] = await Promise.all([pair.reserveA(),pair.reserveB()]
    )
    const reserveIn= fromToken===CONTRACT_ADDRESSES.tokenA ?reserveA:reserveB;
    const reserveOut=fromToken===CONTRACT_ADDRESSES.tokenA?reserveB:reserveA;

    const calculatedOut = (reserveOut * ethers.parseEther(amountIn))/(reserveIn+ethers.parseEther(amountIn))
    setAmountOut(ethers.formatEther(calculatedOut))

     }
     const handleSwap = async ()=>{
        if(!signer || !pairAddress) return ;
        setIsSwapping(true)
        try{
            const tokenContract = new ethers.Contract(fromToken,ERC20_ABI,signer)
            const approveTx = await tokenContract.approve(pairAddress,amountInWei)
            await approveTx.wait();

            const pair = new ethers.Contract(pairAddress,PAIR_ABI,signer)
            const SwapTx= await pair.swap(fromToken,amountInWei)
            await SwapTx.wait();
            toast.success("Swap successful!")
            setAmountIn('')
        } catch(e){
            console.error(e)
           toast.error("Swap failed")
        }finally{
            setIsSwapping(false)
        }
     }
    return <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <ToastContainer position="top-right" autoClose={5000}/>
        <h1 className="text-4xl font-bold font-serif mb-6 mt-2">Swap anytime,<br></br>anywhere.</h1>
    <input type="text" value={fromAmount} onChange={(e)=>{
        setFromAmount(e.target.value)
        calculateOutput(e.target.value)
    }} placeholder="enter the amount to swap" className="p-5 mb-2 w-100  border border-default-medium rounded-full focus:ring-brand focus:border-brand" />
    <input type="text" value={toAmount} readOnly placeholder="you will receive" className="p-5 mb-2 w-100 rounded-full  border border-default-medium focus:ring-brand focus:border-brand" />
    <div className="flex space-x-4 mb-4">
    <select 
        value={fromToken} 
        onChange={(e) => setFromToken(e.target.value)}
        className="p-2 border rounded"
    >
        <option value={CONTRACT_ADDRESSES.tokenA}>TLR</option>
        <option value={CONTRACT_ADDRESSES.tokenB}>BRP</option>
    </select>
    
    <span>→</span>
    
    <select 
        value={toToken} 
        onChange={(e) => setToToken(e.target.value)}
        className="p-2 border rounded"
    >
        <option value={CONTRACT_ADDRESSES.tokenB}>BRP</option>
        <option value={CONTRACT_ADDRESSES.tokenA}>TLR</option>
    </select>
</div>
    <button onClick={!isConnected ? connectWallet : handleSwap}
    disabled={isSwapping || !fromAmount} className="text-white font-bold bg-pink-500 rounded-full p-3 font-serif hover:bg-pink-700 hover:cursor-pointer w-100" >{isSwapping ? "Swapping..." : !isConnected ? "Connect Wallet" : "Swap"}</button>
    </div>
}