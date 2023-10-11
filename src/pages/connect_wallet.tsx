'use client';
import {ethers, formatEther, parseEther} from 'ethers';
import Web3 from 'web3';
import {useEffect, useState} from "react";
import "../style/connect_wallet.css"
export default function Connect_wallet() {
    const [web3,setWeb3]=useState(null);
    const [web3Address,setWeb3Address]=useState("");
    const [web3Amount,setWeb3Amount]=useState("");
    const [provider,setProvider]=useState(null);
    const [ethersAddress,setEthersAddress]=useState("");
    const [ethersAmount,setEthersAmount]=useState("");

    useEffect(()=>{
        if (typeof window.ethereum !== 'undefined') {
            setWeb3(new Web3(window.ethereum));
            setProvider(new ethers.BrowserProvider(window.ethereum));
        }
    },[])

    const initWeb3=async () => {
        if (typeof window.ethereum !== 'undefined') {
            setWeb3Address("");
            setWeb3Amount("");
            await setWeb3(new Web3(window.ethereum));
            try {
                const accounts=await window.ethereum.request({method: 'eth_requestAccounts'});
                const account = accounts[0];
                const balanceWei = await web3.eth.getBalance(account);
                const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
                setWeb3Amount(balanceEther);
                setWeb3Address(accounts);
                console.log('已連接到 MetaMask');
            } catch (error) {
                console.error('連接到 MetaMask 時出現錯誤：', error);
            }
        } else {
            console.log('請安裝 MetaMask 錢包並連接到網絡');
        }

    }
    const initEthers=async ()=> {
        if (typeof window.ethereum !== 'undefined') {
            setEthersAddress("");
            setEthersAmount("");
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setProvider(new ethers.BrowserProvider(window.ethereum));
            const signer = await provider.getSigner();
            const addr= await signer.getAddress();
            const balance = await provider.getBalance(addr);
            setEthersAmount(formatEther(balance));
            setEthersAddress(addr);

        } else {
            console.log('請安裝 MetaMask 錢包並連接到網絡');
        }
    }

    return (
        <main className={"MainFrame"}>
            <h1 className={"Title"}>DApp 核心功能 之 連接錢包帳戶(MetaMask)</h1>
            <div className={"Content"}>
                <div className={"ConnectMethod"}>
                    <button className={"ConnectBtn"} onClick={initWeb3}>Connect to MetaMask <br/>by web3.js</button>
                    <h2 className={"ConnectAddr"}>帳戶地址: {web3Address}</h2>
                    <h2 className={"ConnectAmount"}>帳戶餘額: {web3Amount} ETH</h2>
                </div>
                <div className={"ConnectMethod"}>
                    <button className={"ConnectBtn"} onClick={initEthers}>Connect to MetaMask <br/>by ethers.js</button>
                    <h2 className={"ConnectAddr"}>帳戶地址: {ethersAddress}</h2>
                    <h2 className={"ConnectAmount"}>帳戶餘額: {ethersAmount} ETH</h2>
                </div>
            </div>
        </main>
    );
}
