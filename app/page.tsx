"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

export default function WalletConnection() {
  const [account, setAccount] = useState("");
  const router = useRouter();

  async function connectWallet() {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        toast.error("MetaMask not found");
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      await ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      toast.success("Wallet connected!");

      router.push("/swap");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  }

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    const handleAccountChange = () => connectWallet();

    ethereum.on("accountsChanged", handleAccountChange);
    return () => {
      ethereum.removeListener("accountsChanged", handleAccountChange);
    };
  }, []);

  return (
    <>
      <ToastContainer />

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
        <div>Redirecting to swap page…</div>
      )}
    </>
  );
}
