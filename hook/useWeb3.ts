"use client"
import { JsonRpcSigner } from "ethers"
import { ethers } from "ethers"
import { useEffect, useRef, useState } from "react"

export const useWeb3 = () => {
    const [provider, setProvider] = useState<ethers.Provider | null>(null)
    const [signer, setSigner] = useState<ethers.Signer | null>(null)
    const [account, setAccount] = useState<String | null |JsonRpcSigner>('')
    const [isConnected, setIsConnected] = useState(false)

    const didInit = useRef(false);

    useEffect(() => {
        
    if (typeof window === "undefined" || !(window as any).ethereum) return;

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    provider.listAccounts().then(async (accounts) => {
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0].address);
        console.log(accounts[0],'accounts')
        setIsConnected(true);
      }
    });
  }, []);
    const connectWallet = async () => {
        if ((window as any).ethereum) {
            const provider = new ethers.BrowserProvider((window as any).ethereum)
            const signer = await provider.getSigner()
            const account = await signer.getAddress()
            setProvider(provider)
            setSigner(signer)
            setAccount(account)
            setIsConnected(true)
            console.log("called hook")
        } else {
            alert('Please install Metamask!')
        }


    }
    useEffect(() => {
    if (!(window as any).ethereum) return;

    const eth = (window as any).ethereum;

    eth.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    });

    eth.on("chainChanged", () => {
      window.location.reload();
    });
  }, []);

    return { provider, signer, account, connectWallet, isConnected }
}