"use client"

import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

import { toast, ToastContainer } from "react-toastify"
import { CONTRACT_ADDRESSES, TOKEN_DECIMALS } from "@/lib/constants";
import { ERC20_ABI, FACTORY_ABI, PAIR_ABI } from "@/lib/abi";
import { useWeb3 } from "@/hook/useWeb3";

export default function Liquidity() {
    const { signer, isConnected } = useWeb3()
    console.log(signer, "hi")
    const didInit = useRef(false)
    const [pairAddress, setPairAddress] = useState<string>("");
    const [reserveA, setReserveA] = useState<string>("0");
    const [reserveB, setReserveB] = useState<string>("0");

    const [amountA, setAmountA] = useState<string>("");
    const [amountB, setAmountB] = useState<string>("");

    const [isAdding,setIsAdding]=useState(false)

    const tokenA = CONTRACT_ADDRESSES.tokenA;
    const tokenB = CONTRACT_ADDRESSES.tokenB;


    const loadPairAddress = async () => {
        console.log("laoding pair address")
        if (!signer) return toast.error("no signer");

        try {
            const factory = new ethers.Contract(
                CONTRACT_ADDRESSES.factory,
                FACTORY_ABI,
                signer
            );

            const pair = await factory.getPair(tokenA, tokenB);
            setPairAddress(pair);

            if (pair === ethers.ZeroAddress) {
                toast.error("Pair not created. Use createPair() first");
            }
        } catch (err) {
            console.error(err);
        }
    };


    const loadReserves = async () => {
        if (!pairAddress || pairAddress === ethers.ZeroAddress || !signer) return;

        try {
            const pair = new ethers.Contract(pairAddress, PAIR_ABI, signer);
            const rA = await pair.reserveA();
            const rB = await pair.reserveB();

            setReserveA(ethers.formatUnits(rA, TOKEN_DECIMALS));
            setReserveB(ethers.formatUnits(rB, TOKEN_DECIMALS));
           
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!signer || didInit.current) return;
        didInit.current = true
        loadPairAddress();
    }, [signer]);

    useEffect(() => {
        if (pairAddress) loadReserves();
    }, [pairAddress]);

    
    const addLiquidity = async () => {
        
        if (!isConnected) {
            return toast.error("Connect your wallet");
        }

        if (!pairAddress || pairAddress === ethers.ZeroAddress) {
            return toast.error("Pair does not exist");
        }

        if (!amountA || !amountB) {
            return toast.error("Enter both amounts");
        }

        try {
            setIsAdding(true)
            const amountAWei = ethers.parseUnits(amountA, TOKEN_DECIMALS);
            const amountBWei = ethers.parseUnits(amountB, TOKEN_DECIMALS);

            
            const tokenAContract = new ethers.Contract(tokenA, ERC20_ABI, signer);
            const approveA = await tokenAContract.approve(pairAddress, amountAWei);
            
            await approveA.wait();

            const tokenBContract = new ethers.Contract(tokenB, ERC20_ABI, signer);
            const approveB = await tokenBContract.approve(pairAddress, amountBWei);
            await approveB.wait();

            
            const pair = new ethers.Contract(pairAddress, PAIR_ABI, signer);
            const tx = await pair.addLiquidity(amountAWei, amountBWei);
            await tx.wait();

            toast.success("Liquidity added successfully!");

            setAmountA("");
            setAmountB("");

            loadReserves();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add liquidity");
        }finally{
            setIsAdding(false)
        }
    };

    return (
        <div className="flex flex-col justify-center h-screen items-center p-8 bg-slate-200">
            <ToastContainer position="top-center" autoClose={5000} />
            <h1 className="text-3xl font-bold mb-6 font-serif">Add Liquidity</h1>

            <div className="mb-4 text-gray-600">
                <p><strong>Pair Address:</strong> {pairAddress}</p>
                <p><strong>TLR Reserve:</strong> {reserveA}</p>
                <p><strong>BRP Reserve:</strong> {reserveB}</p>
            </div>

            <div >
                <input
                    type="text"
                    placeholder="Amount Token A"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                   className="bg-gray-50 mb-2  border border-gray-300 text-gray-900 text-sm rounded-lg outline-none  block w-80 p-2.5" 
                />

                <input
                    type="text"
                    placeholder="Amount Token B"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg outline-none  block w-80 p-2.5"
                />

                <button
                    onClick={addLiquidity}
                    className="w-full bg-pink-500 text-white p-3 rounded-full hover:bg-pink-700"
                >
                   {isAdding?"Adding..":"Add Liquidity"}
                </button>
            </div>
        </div>
    );
}
