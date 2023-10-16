'use client';
import {useEffect, useRef, useState} from "react";
import "../app/globals.css"
import "../style/interact_contract.css"
import {ethers} from "ethers";
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { createTheme,ThemeProvider } from '@mui/material/styles';

import Link from "next/link";
import "../../global.d"

class ContractMethod{
    Result:string;
    Type:string;
    Method:string;
    Parameters:string[];
    Index:number;
    Payable:boolean;
    Amount:number;

    constructor() {
        this.Result="";
        this.Type="";
        this.Method="";
        this.Parameters=[];
        this.Index=0;
        this.Payable=false;
        this.Amount=0;
    }

}
export default function Interact_contract() {
    const addressRef=useRef<HTMLInputElement|null>(null);
    const abiRef=useRef<HTMLInputElement|null>(null);

    const [workers,setWorkers]=useState([new ContractMethod()]);

    const [abiContent, setAbiContent] = useState([{"inputs":[],"stateMutability":"","name":"","type":""}]);
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#1976d2',
            },
        },
    });



    useEffect(() => {
        let currentAbiRef = abiRef.current;

        if (currentAbiRef) {
            currentAbiRef.addEventListener('change', handleFileChange);
        }

        return () => {
            if (currentAbiRef) {
                currentAbiRef.removeEventListener('change', handleFileChange);
            }
        };
    }, []);


    const handleFileChange = async () => {
        const file = abiRef.current!.files![0];
        if (file) {
            try {
                const fileContents = await file.text();
                setAbiContent(JSON.parse(fileContents).abi)
            } catch (error) {
                alert(error);
            }
        }
    };
    const addActionBlock=()=>{
        let tmp=[...workers];
        tmp.push(new ContractMethod());
        setWorkers(tmp);
    }
    const handleTypeChange=(index:number,event:any)=>{
        let tmp=[...workers];
        tmp[index].Type=event.target.value;
        setWorkers(tmp);
    }
    const handleMethodChange=(index:number,event:any)=>{
        let tmp=[...workers];
        tmp[index].Method=event.target.value;
        abiContent.map((item,i)=>{
            if (item["name"]===event.target.value){
                tmp[index].Index=i;
                if (item["stateMutability"]==="payable"){
                    tmp[index].Payable=true;
                    tmp[index].Amount=0;
                } else{
                    tmp[index].Payable=false;
                    tmp[index].Amount=0;
                }
                tmp[index].Parameters=Array(item["inputs"].length).fill('')
            }
        })
        setWorkers(tmp);
    }
    const parametersChange=(index:number,inputIndex:number,val:any)=>{
        let tmp=[...workers];
        tmp[index].Parameters[inputIndex]=val;
        setWorkers(tmp);
    }
    const editAmount=(index:number,event:any)=>{
        let tmp=[...workers];
        tmp[index].Amount=event.target.value;
        setWorkers(tmp);
    }
    const ContractInteraction=async (index:number) => {
        if (typeof window.ethereum !== 'undefined') {
            const contractAddress = addressRef.current!.value;
            const contractAbi = abiContent;
            await window.ethereum.request({method: 'eth_requestAccounts'});
            const provider=new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            if (workers[index].Type==="event"){
                const filter = contract.filters[workers[index].Method]();
                const events = await contract.queryFilter(filter);
                let tmp=[...workers]
                let ans=[];
                for (let i = 0; i < events.length; i++) {
                    // @ts-ignore
                    ans.push({"index":i,"Value":events[i].args.toString()})
                }
                tmp[index].Result=JSON.stringify(ans);
                setWorkers(tmp);
            } else{
                if (workers[index].Payable){
                    const basicFoundation = ethers.parseEther(workers[index].Amount.toString());

                    await contract[workers[index].Method](...workers[index].Parameters,{value:basicFoundation}).then((result)=>{
                        console.log("Result: ",result.toString());

                        let tmp=[...workers];
                        tmp[index].Result=result.toString();
                        setWorkers(tmp);
                    }).catch((e)=>{
                        alert(e);
                    })
                } else{
                    await contract[workers[index].Method](...workers[index].Parameters).then((result)=>{
                        console.log("Result: ",result);
                        let tmp=[...workers];
                        tmp[index].Result=result.toString();
                        setWorkers(tmp);
                    }).catch((e)=>{
                        alert(e);
                    })
                }
            }
        } else {
            alert('請安裝 MetaMask 錢包並連接到網絡');
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
            </ThemeProvider>
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
                            與智能合約的互動
                        </span>
                </h1>
                <div className={"ContractInfo"}>
                    <h2 className={"ContractDetails"}>智能合約地址&nbsp;:&nbsp;&nbsp;<input ref={addressRef} type={"text"}/></h2>
                    <h2 className={"ContractDetails"}>智能合約ABI文檔(.json)&nbsp;:&nbsp;&nbsp;<input ref={abiRef} type={"file"} accept=".json"/></h2>
                </div>
                <h2>相關互動函式</h2>
                {workers.map((item,index)=>{
                    return(
                        <div key={index} className={"ActionSpace"}>
                            <div className={"ActionFunction"}>
                                <h3>函式 與 監聽事件</h3>
                                <h4>種類:
                                    <select onChange={(e)=>{handleTypeChange(index,e)}} value={workers[index].Type}>
                                        <option value={""}>None</option>
                                        <option value={"function"}>Function</option>
                                        <option value={"event"}>Event</option>
                                    </select>
                                </h4>
                                <h4>選擇:
                                    <select onChange={(e)=>{handleMethodChange(index,e)}} value={workers[index].Method}>
                                        <option value={""}>None</option>
                                        {abiContent.map((abiItem,abiIndex)=>{
                                            if (abiItem["name"]!==undefined && abiItem["type"]===workers[index].Type){
                                                return (
                                                    <option key={abiIndex} value={abiItem["name"]}>{abiItem["name"]}</option>
                                                );
                                            }
                                        })}
                                    </select>
                                </h4>
                                <h3>參數</h3>
                                {abiContent[item.Index] && abiContent[item.Index]["inputs"].map((inputItem:any,inputIndex:number)=>{
                                    return (
                                        <h4 key={inputIndex}>{inputItem["name"]}:&nbsp;&nbsp;<input
                                            value={item.Parameters[inputIndex]}
                                            onChange={(e) => parametersChange(index,inputIndex, e.target.value)}
                                            type={"text"}/></h4>
                                    )
                                })}
                                <h3>金額</h3>
                                {item.Payable && (
                                    <h4>
                                        總共&nbsp;&nbsp;<input onChange={(e)=>{editAmount(index,e)}} type={"number"}/>&nbsp;&nbsp;ETH
                                    </h4>
                                )}
                                <div className={"ExecuteSpace"}>
                                    <button className={"ConnectBtn"} onClick={async () => {await ContractInteraction(index);}}>執行合約</button>
                                </div>
                            </div>
                            <div className={"ConnectMethod"}>
                                <h3>Result:</h3>
                                <p>{item.Result}</p>
                            </div>
                        </div>) ;
                })}
                <div className={"AddBlock"}>
                    <button className={"AddBtn"} onClick={addActionBlock}>新增執行方塊</button>
                </div>

            </main>
        </Container>
    );
}
