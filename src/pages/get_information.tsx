'use client';
import {ethers, formatEther, parseEther} from 'ethers';
import Web3 from 'web3';
import {useEffect, useRef, useState} from "react";
import "../style/get_information.css";

class BlockInfo{
    BlockHeight:number
    BlockHash:string
    PreviousHash:string
}
class TransactionInfo{
    BlockHeight:number
    Hash:string
    From:string
    To:string
    Amount:string
    Fee:string
}
export default function Get_information() {
    const urlRef = useRef<HTMLInputElement | null>(null);
    const heightRef = useRef<HTMLInputElement | null>(null);
    const hashRef = useRef<HTMLInputElement | null>(null);
    const transactionHashRef = useRef<HTMLInputElement | null>(null);
    const [lastBlockNumberWeb3,setLastBlockNumberWeb3]=useState(0);
    const [lastBlockNumberEthers,setLastBlockNumberEthers]=useState(0);
    const [blockByHeightWeb3,setBlockByHeightWeb3]=useState(new BlockInfo());
    const [blockByHeightEthers,setBlockByHeightEthers]=useState(new BlockInfo());
    const [blockByHashWeb3,setBlockByHashWeb3]=useState(new BlockInfo());
    const [blockByHashEthers,setBlockByHashEthers]=useState(new BlockInfo());
    const [transactionWeb3,setTransactionWeb3]=useState(new TransactionInfo());
    const [transactionEthers,setTransactionEthers]=useState(new TransactionInfo());

    const getBlockHeightWeb3=()=>{
        setLastBlockNumberEthers(0);
        const url=urlRef.current?.value.toString()
        const web3 = new Web3(url);
        web3.eth.getBlockNumber()
            .then(blockNumber => {
                console.log('最新區塊高度：', blockNumber);
                setLastBlockNumberWeb3(Number(blockNumber));
            })
            .catch(error => {
                console.error('獲取區塊高度時發生錯誤：', error);
            });
    }
    const getBlockByHeightWeb3=()=>{
        const url=urlRef.current?.value.toString()
        const web3 = new Web3(url);
        const blockNumber=Number(heightRef.current?.value);
        web3.eth.getBlock(blockNumber).then(blockInfo => {
            if (blockInfo) {
                let tmp=new BlockInfo();
                tmp.BlockHeight=Number(blockInfo.number);
                tmp.BlockHash=blockInfo.hash;
                tmp.PreviousHash=blockInfo.parentHash;
                setBlockByHeightWeb3(tmp);
                console.log('區塊資訊：', blockInfo);
            } else {
                alert(`找不到區塊號 ${blockNumber} 的資訊。`);
            }
        }).catch(error => {
            alert('發生錯誤：'+ error);
        });
    }
    const getBlockByHashWeb3=()=>{
        const url=urlRef.current?.value.toString()
        const web3 = new Web3(url);
        const blockHash=hashRef.current?.value;
        web3.eth.getBlock(blockHash,true).then(blockInfo => {
            if (blockInfo) {
                let tmp=new BlockInfo();
                tmp.BlockHeight=Number(blockInfo.number);
                tmp.BlockHash=blockInfo.hash;
                tmp.PreviousHash=blockInfo.parentHash;
                setBlockByHashWeb3(tmp);
                console.log('區塊資訊：', blockInfo);
            } else {
                alert(`找不到區塊號 ${blockHash} 的資訊。`);
            }
        }).catch(error => {
            alert('發生錯誤：'+ error);
        });
    }
    const getTransactionWeb3=()=>{
        const url=urlRef.current?.value.toString()
        const web3 = new Web3(url);
        const transactionHash = transactionHashRef.current?.value.toString();

        web3.eth.getTransaction(transactionHash)
            .then(transactionInfo => {
                if (transactionInfo) {
                    console.log('交易資訊：', transactionInfo);
                    let tmp=new TransactionInfo();
                    tmp.From=transactionInfo.from;
                    tmp.To=transactionInfo.to;
                    tmp.Amount=formatEther(transactionInfo.value);
                    tmp.Fee=formatEther(transactionInfo.maxFeePerGas+transactionInfo.maxPriorityFeePerGas);
                    tmp.BlockHeight=Number(transactionInfo.blockNumber);
                    tmp.Hash=transactionInfo.hash;
                    setTransactionWeb3(tmp);
                } else {
                    alert(`找不到交易哈希 ${transactionHash} 的資訊。`);
                }
            }).catch(error => {
            alert('發生錯誤：'+ error);
        });
    }

    const getBlockHeightEthers=()=>{
        setLastBlockNumberEthers(0);
        const url=urlRef.current?.value.toString()
        const provider = new ethers.JsonRpcProvider(url);
        provider.getBlockNumber().then(blockNumber => {
            setLastBlockNumberEthers(blockNumber);
        }).catch((e)=>{
            alert("error: "+e);
        });
    }
    const getBlockByHeightEthers=()=>{
        const url=urlRef.current?.value.toString()
        const provider = new ethers.JsonRpcProvider(url);
        const blockNumber=Number(heightRef.current?.value);
        provider.getBlock(blockNumber).then(blockInfo => {
            if (blockInfo) {
                let tmp=new BlockInfo();
                tmp.BlockHeight=blockInfo.number;
                tmp.BlockHash=blockInfo.hash;
                tmp.PreviousHash=blockInfo.parentHash;
                setBlockByHeightEthers(tmp);
                console.log('區塊資訊：', blockInfo);
            } else {
                alert(`找不到區塊號 ${blockNumber} 的資訊。`);
            }
        }).catch(error => {
            alert('發生錯誤：'+ error);
        });
    }
    const getBlockByHashEthers=()=>{
        const url=urlRef.current?.value.toString()
        const provider = new ethers.JsonRpcProvider(url);
        const blockHash=hashRef.current?.value;
        provider.getBlock(blockHash).then(blockInfo => {
            if (blockInfo) {
                let tmp=new BlockInfo();
                tmp.BlockHeight=blockInfo.number;
                tmp.BlockHash=blockInfo.hash;
                tmp.PreviousHash=blockInfo.parentHash;
                setBlockByHashEthers(tmp);
                console.log('區塊資訊：', blockInfo);
            } else {
                alert(`找不到區塊號 ${blockHash} 的資訊。`);
            }
        }).catch(error => {
            alert('發生錯誤：'+ error);
        });
    }
    const getTransactionEthers=()=>{
        const url=urlRef.current?.value.toString();
        const provider = new ethers.JsonRpcProvider(url);
        const transactionHash=transactionHashRef.current?.value.toString();
        provider.getTransaction(transactionHash).then(transactionInfo => {
            if (transactionInfo) {
                console.log('交易資訊：', transactionInfo);
                let tmp=new TransactionInfo();
                tmp.From=transactionInfo.from;
                tmp.To=transactionInfo.to;
                tmp.Amount=formatEther(transactionInfo.value);
                tmp.Fee=formatEther(transactionInfo.maxFeePerGas+transactionInfo.maxPriorityFeePerGas);
                tmp.BlockHeight=transactionInfo.blockNumber;
                tmp.Hash=transactionInfo.hash;
                setTransactionEthers(tmp);
            } else {
                alert(`找不到交易哈希 ${transactionHash} 的資訊。`);
            }
        }).catch(error => {
            alert('發生錯誤：'+ error);
        });
    }

    return (
        <main className={"MainFrame"}>
            <h1 className={"Title"}>DApp 核心功能 之 獲取區塊鏈資訊</h1>
            <h3>區塊鏈網路: <input ref={urlRef} type={"text"} placeholder={"BlockChain URL"}/></h3>
            <div className={"InfoContent"}>
                <h2>區塊資訊</h2>
                <h3>最新區塊高度</h3>
                <div className={"Content"}>
                    <div className={"ConnectMethod"}>
                        <button className={"ConnectBtn"} onClick={getBlockHeightWeb3}>Get the block number by web3.js</button>
                        <h4 className={"ContentItem"}>最新區塊高度: {lastBlockNumberWeb3}</h4>
                    </div>
                    <div className={"ConnectMethod"}>
                        <button className={"ConnectBtn"} onClick={getBlockHeightEthers}>Get the block number by ethers.js</button>
                        <h4 className={"ContentItem"}>最新區塊高度: {lastBlockNumberEthers}</h4>
                    </div>
                </div>
                <h3>獲取區塊資訊從區塊高度: <input ref={heightRef} type={"number"} placeholder={"BlockHeight"}/></h3>
                <div className={"Content"}>
                    <div className={"ConnectMethod"}>
                        <button className={"ConnectBtn"} onClick={getBlockByHeightWeb3}>Get block by height in web3.js</button>
                        <h4 className={"ContentItem"}>區塊高度: {blockByHeightWeb3.BlockHeight}</h4>
                        <h4 className={"ContentItem"}>區塊哈希: {blockByHeightWeb3.BlockHash}</h4>
                        <h4 className={"ContentItem"}>前一區塊哈希: {blockByHeightWeb3.PreviousHash}</h4>
                    </div>
                    <div className={"ConnectMethod"}>
                        <button className={"ConnectBtn"} onClick={getBlockByHeightEthers}>Get block by height in ethers.js</button>
                        <h4 className={"ContentItem"}>區塊高度: {blockByHeightEthers.BlockHeight}</h4>
                        <h4 className={"ContentItem"}>區塊哈希: {blockByHeightEthers.BlockHash}</h4>
                        <h4 className={"ContentItem"}>前一區塊哈希: {blockByHeightEthers.PreviousHash}</h4>
                    </div>
                </div>
                <h3>獲取區塊資訊從區塊哈希: <input ref={hashRef} type={"text"} placeholder={"BlockHash"}/></h3>
                <div className={"Content"}>
                    <div className={"ConnectMethod"}>
                        <button className={"ConnectBtn"} onClick={getBlockByHashWeb3}>Get block by hash in web3.js</button>
                        <h4 className={"ContentItem"}>區塊高度: {blockByHashWeb3.BlockHeight}</h4>
                        <h4 className={"ContentItem"}>區塊哈希: {blockByHashWeb3.BlockHash}</h4>
                        <h4 className={"ContentItem"}>前一區塊哈希: {blockByHashWeb3.PreviousHash}</h4>
                    </div>
                    <div className={"ConnectMethod"}>
                        <button className={"ConnectBtn"} onClick={getBlockByHashEthers}>Get block by hash in ethers.js</button>
                        <h4 className={"ContentItem"}>區塊高度: {blockByHashEthers.BlockHeight}</h4>
                        <h4 className={"ContentItem"}>區塊哈希: {blockByHashEthers.BlockHash}</h4>
                        <h4 className={"ContentItem"}>前一區塊哈希: {blockByHashEthers.PreviousHash}</h4>
                    </div>
                </div>
            </div>
            <div className={"InfoContent"}>
                <h2>交易資訊</h2>
                <h3>獲取交易資訊從交易哈希: <input ref={transactionHashRef} type={"text"} placeholder={"TransactionHash"}/></h3>
                <div className={"Content"}>
                    <div className={"ConnectMethod"}>
                        <button className={"ConnectBtn"} onClick={getTransactionWeb3}>Get transaction by web3.js</button>
                        <h4 className={"ContentItem"}>儲存位置的區塊高度: {transactionWeb3.BlockHeight}</h4>
                        <h4 className={"ContentItem"}>交易哈希: {transactionWeb3.Hash}</h4>
                        <h4 className={"ContentItem"}>發起交易 帳戶地址: {transactionWeb3.From}</h4>
                        <h4 className={"ContentItem"}>接收交易 帳戶地址: {transactionWeb3.To}</h4>
                        <h4 className={"ContentItem"}>交易金額: {transactionWeb3.Amount} ETH</h4>
                        <h4 className={"ContentItem"}>交易手續費: {transactionWeb3.Fee} ETH</h4>
                    </div>
                    <div className={"ConnectMethod"}>
                        <button className={"ConnectBtn"} onClick={getTransactionEthers}>Get transaction by ethers.js</button>
                        <h4 className={"ContentItem"}>儲存位置的區塊高度: {transactionEthers.BlockHeight}</h4>
                        <h4 className={"ContentItem"}>交易哈希: {transactionEthers.Hash}</h4>
                        <h4 className={"ContentItem"}>發起交易 帳戶地址: {transactionEthers.From}</h4>
                        <h4 className={"ContentItem"}>接收交易 帳戶地址: {transactionEthers.To}</h4>
                        <h4 className={"ContentItem"}>交易金額: {transactionEthers.Amount} ETH</h4>
                        <h4 className={"ContentItem"}>交易手續費: {transactionEthers.Fee} ETH</h4>
                    </div>
                </div>
            </div>
        </main>
    );
}
