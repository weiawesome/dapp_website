'use client';
import {ethers, formatEther} from 'ethers';
import Web3 from 'web3';
import {useEffect, useState} from "react";
import "../app/globals.css"
import "../style/connect_wallet.css"
import {AppBar, Container, ThemeProvider, Toolbar} from "@mui/material";
import Link from "next/link";
import {createTheme} from "@mui/material/styles";
export default function Connect_wallet() {
    const [web3,setWeb3]=useState(null);
    const [web3Address,setWeb3Address]=useState("");
    const [web3Amount,setWeb3Amount]=useState("");
    const [provider,setProvider]=useState(null);
    const [ethersAddress,setEthersAddress]=useState("");
    const [ethersAmount,setEthersAmount]=useState("");
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });

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
        <Container>
            <ThemeProvider theme={darkTheme}>
                <AppBar position="static">
                    <Toolbar style={{display:"flex",justifyContent:"space-evenly"}}>
                        <Link className={"RouterBtn"} href={"/"}>主頁</Link>
                        <Link className={"RouterBtn"} href={"/connect_wallet"}>連結錢包</Link>
                        <Link className={"RouterBtn"} href={"/get_information"}>區塊資訊</Link>
                        <Link className={"RouterBtn"} href={"/build_transaction"}>建立交易</Link>
                        <Link className={"RouterBtn"} href={"/interact_contract"}>合約互動</Link>
                    </Toolbar>
                </AppBar>
                <main className={"MainFrame"}>
                    <h1 className={"falling-text"}>
                        <span>
                            D
                        </span>
                        <span>
                            App
                        </span>
                        <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;核心功能&nbsp;&nbsp;
                        </span>
                        <span>
                            之&nbsp;&nbsp;
                        </span>
                        <span>
                            連接錢包帳戶(MetaMask)
                        </span>
                    </h1>
                    <div className={"Content"}>
                        <div className={"ConnectMethod"}>
                            <button className={"ConnectBtn"} onClick={initWeb3}>Connect to MetaMask <br/>by web3.js</button>
                            <h2 className={"ConnectContent"}>帳戶地址&nbsp;: {web3Address}</h2>
                            <h2 className={"ConnectContent"}>帳戶餘額&nbsp;: {web3Amount} ETH</h2>
                        </div>
                        <div className={"ConnectMethod"}>
                            <button className={"ConnectBtn"} onClick={initEthers}>Connect to MetaMask <br/>by ethers.js</button>
                            <h2 className={"ConnectContent"}>帳戶地址&nbsp;: {ethersAddress}</h2>
                            <h2 className={"ConnectContent"}>帳戶餘額&nbsp;: {ethersAmount} ETH</h2>
                        </div>
                    </div>
                </main>
            </ThemeProvider>
        </Container>

    );
}
