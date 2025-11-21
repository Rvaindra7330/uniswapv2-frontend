import { ethers } from "ethers"
import { useState } from "react"

export const useWeb3 = ()=>{
    const [provider,setProvider]=useState<ethers.Provider | null>(null)
    const [signer,setSigner] = useState<ethers.Signer | null>(null)
    const [account,setAccount] = useState<String |null>('')

    const connectWallet= async()=>{
        if((window as any).ethereum){
            const provider = new ethers.BrowserProvider((window as any).ethereum)
            const signer = await provider.getSigner()
            const account = await signer.getAddress()
            setProvider(provider)
            setSigner(signer)
            setAccount(account)
        } else{
            alert('Please install Metamask!')
        }
       
    }
     return {provider,signer,account,connectWallet}
}