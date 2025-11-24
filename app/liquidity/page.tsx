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
            toast.success("pair created")
            console.log("pair", pair)

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
            
            const amountAWei = ethers.parseUnits(amountA, TOKEN_DECIMALS);
            const amountBWei = ethers.parseUnits(amountB, TOKEN_DECIMALS);

            
            const tokenAContract = new ethers.Contract(tokenA, ERC20_ABI, signer);
            const approveA = await tokenAContract.approve(pairAddress, amountAWei);
            console.log("in2")
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
        }
    };

    return (
        <div className="flex flex-col items-center p-8">
            <ToastContainer position="top-center" autoClose={5000} />
            <h1 className="text-3xl font-bold mb-6">Add Liquidity</h1>

            <div className="mb-4">
                <p><strong>Pair Address:</strong> {pairAddress}</p>
                <p><strong>Reserve A:</strong> {reserveA}</p>
                <p><strong>Reserve B:</strong> {reserveB}</p>
            </div>

            <div className="border p-6 rounded-xl w-[350px]">
                <input
                    type="text"
                    placeholder="Amount Token A"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    className="w-full mb-4 p-3 border rounded"
                />

                <input
                    type="text"
                    placeholder="Amount Token B"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    className="w-full mb-4 p-3 border rounded"
                />

                <button
                    onClick={addLiquidity}
                    className="w-full bg-pink-600 text-white p-3 rounded hover:bg-pink-700"
                >
                    Add Liquidity
                </button>
            </div>
        </div>
    );
}
