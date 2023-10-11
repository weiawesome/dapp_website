// 'use client';
// import {ethers, formatEther, parseEther} from 'ethers';
// import Web3 from 'web3';
// import {useEffect, useState} from "react";
// import "../style/connect_wallet.css"
// export default function Build_transaction() {
//     const [web3,setWeb3]=useState(null);
//     const [web3Address,setWeb3Address]=useState("");
//     const [web3Amount,setWeb3Amount]=useState("");
//     const [provider,setProvider]=useState(null);
//     const [ethersAddress,setEthersAddress]=useState("");
//     const [ethersAmount,setEthersAmount]=useState("");
//
//     useEffect(()=>{
//         if (typeof window.ethereum !== 'undefined') {
//             setWeb3(new Web3(window.ethereum));
//             setProvider(new ethers.BrowserProvider(window.ethereum));
//         }
//     },[])
//
//     const initWeb3=async () => {
//         if (typeof window.ethereum !== 'undefined') {
//             setWeb3Address("");
//             setWeb3Amount("");
//             await setWeb3(new Web3(window.ethereum));
//             try {
//                 const accounts=await window.ethereum.request({method: 'eth_requestAccounts'});
//                 const account = accounts[0];
//                 const balanceWei = await web3.eth.getBalance(account);
//                 const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
//                 setWeb3Amount(balanceEther);
//                 setWeb3Address(accounts);
//                 console.log('已連接到 MetaMask');
//             } catch (error) {
//                 console.error('連接到 MetaMask 時出現錯誤：', error);
//             }
//         } else {
//             console.log('請安裝 MetaMask 錢包並連接到網絡');
//         }
//
//     }
//     const initEthers=async ()=> {
//         if (typeof window.ethereum !== 'undefined') {
//             setEthersAddress("");
//             setEthersAmount("");
//             await window.ethereum.request({ method: 'eth_requestAccounts' });
//             setProvider(new ethers.BrowserProvider(window.ethereum));
//             const signer = await provider.getSigner();
//             const addr= await signer.getAddress();
//             const balance = await provider.getBalance(addr);
//             setEthersAmount(formatEther(balance));
//             setEthersAddress(addr);
//
//         } else {
//             console.log('請安裝 MetaMask 錢包並連接到網絡');
//         }
//     }
//
//     const test=async () => {
//         try {
//             // 檢查 MetaMask 是否已安裝並連接
//             if (!window.ethereum || !window.ethereum.isConnected()) {
//                 throw new Error('請安裝 MetaMask 並連接到一個 Ethereum 網路');
//             }
//
//             // 使用 MetaMask 的 provider 建立一個新的 ethers provider
//             let provider = new ethers.BrowserProvider(window["ethereum"]);
//
//             // 取得已連接帳戶的 signer 物件
//             const signer =await provider.getSigner();
//
//             const tx = {
//                 to: '0x9FCfd3437f0a96A13D1Ef89bdd08b98034644b4b', // 替換成你想要發送到的地址
//                 value: parseEther('10'),
//             };
//
//             // 發送交易
//             const transactionResponse = await signer.sendTransaction(tx);
//
//             console.log('交易已發送，等待確認...');
//             console.log(transactionResponse);
//
//             // 等待交易被確認
//             const transactionReceipt = await transactionResponse.wait();
//
//             console.log('交易已確認');
//             console.log(transactionReceipt);
//         } catch (error) {
//             console.error('提交交易時發生錯誤:', error);
//         }
//     }
//     const aa=async () => {
//         if (!window.ethereum || !window.ethereum.isConnected()) {
//             throw new Error('請安裝 MetaMask 並連接到一個 Ethereum 網路');
//         }
//         const provider = window.ethereum;
//         const web3 = new Web3(provider);
//         if (web3.eth.accounts.length === 0) {
//             console.log('MetaMask 錢包未解鎖。');
//             return;
//         }
//         const toAddress = '0x9FCfd3437f0a96A13D1Ef89bdd08b98034644b4b';
//         const amountToSend = web3.utils.toWei('10', 'ether'); // 要轉送的以太數量
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const account = accounts[0];
//         console.log(amountToSend);
//         const transactionObject = {
//             from: account.toString(),
//             to: toAddress,
//             value: amountToSend,
//         };
//
//         web3.eth.sendTransaction(transactionObject)
//             .on('transactionHash', hash => {
//                 console.log('交易哈希：', hash);
//             })
//             .on('receipt', receipt => {
//                 console.log('交易收據：', receipt);
//             })
//             .on('error', error => {
//                 console.error('發送交易時發生錯誤：', error);
//             })
//
//     }
//
//     return (
//         <main className={"MainFrame"}>
//             <h1 className={"Title"}>DApp 核心功能 之 連接錢包帳戶(MetaMask)</h1>
//             <div className={"Content"}>
//                 <div className={"ConnectMethod"}>
//                     <button className={"ConnectBtn"} onClick={aa}>Connect to MetaMask <br/>by web3.js</button>
//                     <h2 className={"ConnectAddr"}>帳戶地址: {web3Address}</h2>
//                     <h2 className={"ConnectAmount"}>帳戶餘額: {web3Amount} ETH</h2>
//                 </div>
//                 <div className={"ConnectMethod"}>
//                     <button className={"ConnectBtn"} onClick={test}>Connect to MetaMask <br/>by ethers.js</button>
//                     <h2 className={"ConnectAddr"}>帳戶地址: {ethersAddress}</h2>
//                     <h2 className={"ConnectAmount"}>帳戶餘額: {ethersAmount} ETH</h2>
//                 </div>
//             </div>
//         </main>
//     );
// }
