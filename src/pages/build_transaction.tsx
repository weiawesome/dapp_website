'use client';
import {ethers, parseEther} from 'ethers';
import Web3 from 'web3';
import {useRef, useState} from "react";
import "../app/globals.css"
import "../style/build_transaction.css"
import {AppBar, Container, ThemeProvider, Toolbar} from "@mui/material";
import Link from "next/link";
import {createTheme} from "@mui/material/styles";
class Receipt{
    constructor() {
        this.TransactionHash="";
        this.From="";
        this.To="";
        this.BlockHash="";
        this.BlockHeight=0;
    }
    TransactionHash:string;
    From:string;
    To:string | null;
    BlockHash:string;
    BlockHeight:number| null
}
export default function Build_transaction() {
    const [r,setR]=useState(new Receipt());
    const addrRef=useRef<HTMLInputElement|null>(null);
    const valueRef=useRef<HTMLInputElement|null>(null);
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });
    const BuildTransactionEthers=async () => {
        try {
            if (typeof window.ethereum!=="undefined" || !window.ethereum.isConnected()) {
                throw new Error('請安裝 MetaMask 並連接到一個 Ethereum 網路');
            }

            let provider = new ethers.BrowserProvider(window["ethereum"]);

            const signer =await provider.getSigner();

            const tx = {
                to: addrRef.current!.value,
                value: parseEther(valueRef.current!.value),
            };

            const transactionResponse = await signer.sendTransaction(tx);

            console.log(transactionResponse);

            const transactionReceipt = await transactionResponse.wait();

            let tmp=new Receipt();
            tmp.BlockHeight=transactionReceipt!.blockNumber;
            tmp.BlockHash=transactionReceipt!.blockHash;
            tmp.TransactionHash=transactionReceipt!.hash;
            tmp.From=transactionReceipt!.from;
            tmp.To=transactionReceipt!.to;
            setR(tmp);
            console.log(transactionReceipt);

        } catch (error) {
            console.error('提交交易時發生錯誤:', error);
        }
    }
    const BuildTransactionWeb3=async () => {
        try {
            if (typeof window.ethereum!=="undefined" || !window.ethereum.isConnected()) {
                throw new Error('請安裝 MetaMask 並連接到一個 Ethereum 網路');
            }
            const provider = window.ethereum;
            const web3 = new Web3(provider);
            const toAddress = addrRef.current?.value;

            const amountToSend = web3.utils.toWei(valueRef.current!.value, 'ether');
            console.log(amountToSend);
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            const account = accounts[0];
            const transactionObject = {
                from: account.toString(),
                to: toAddress,
                value: amountToSend,
            };

            web3.eth.sendTransaction(transactionObject)
                .on('transactionHash', hash => {
                    console.log('交易哈希：', hash);
                })
                .on('receipt', transactionReceipt => {
                    console.log('交易收據：', transactionReceipt);
                    let tmp = new Receipt();
                    tmp.BlockHeight = Number(transactionReceipt!.blockNumber);
                    tmp.BlockHash = transactionReceipt!.blockHash;
                    tmp.TransactionHash = transactionReceipt!.transactionHash;
                    tmp.From = transactionReceipt!.from;
                    tmp.To = transactionReceipt!.to;
                    setR(tmp);
                })
                .on('error', error => {
                })
        } catch (error) {
            console.log(error);
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
                            建立交易
                        </span>
                    </h1>
                    <div className={"TransactionInfo"}>
                        <h2 className={"InfoDetails"}>
                            交易地址&nbsp;:&nbsp;&nbsp;<input ref={addrRef} type={"text"}/>
                        </h2>
                        <h2 className={"InfoDetails"}>
                            交易金額&nbsp;:&nbsp;&nbsp;<input ref={valueRef} type={"number"}/>
                        </h2>
                    </div>
                    <div className={"Content"}>
                        <button className={"ConnectBtn"} onClick={BuildTransactionWeb3}>By web3.js</button>
                        <button className={"ConnectBtn"} onClick={BuildTransactionEthers}>By ethers.js</button>
                    </div>
                    <div className={"Result"}>
                        <h2 className={"Center-text"}>帳單明細</h2>
                        <h3 className={"Center-text"}>交易資訊</h3>
                        <div className={"Result-div"}>
                            <h4>交易哈希:&nbsp;&nbsp;{r.TransactionHash}</h4>
                            <h4>交易發起地址:&nbsp;&nbsp;{r.From}</h4>
                            <h4>交易接收地址:&nbsp;&nbsp;{r.To}</h4>
                        </div>
                        <h3 className={"Center-text"}>區塊資訊</h3>
                        <div className={"Result-div"}>
                            <h4>區塊哈希:&nbsp;&nbsp;{r.BlockHash}</h4>
                            <h4>區塊高度:&nbsp;&nbsp;{r.BlockHeight}</h4>
                        </div>
                    </div>
                </main>
            </ThemeProvider>
        </Container>
    );
}
