"use client"
import { ethers } from "ethers"
import { useEffect, useRef, useState } from "react"

export const useWeb3 = () => {
    const [provider, setProvider] = useState<ethers.Provider | null>(null)
    const [signer, setSigner] = useState<ethers.Signer | null>(null)
    const [account, setAccount] = useState<String | null>('')
    const [isConnected, setIsConnected] = useState(false)

    const didInit = useRef(false);

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;


        (async () => {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner()
            const account = await signer.getAddress()
            setSigner(signer);
            setAccount(account);
            setIsConnected(true);

        })();
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

    return { provider, signer, account, connectWallet, isConnected }
}