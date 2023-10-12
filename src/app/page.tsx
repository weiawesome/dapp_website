'use client';
import "../style/index.css"
import Link from "next/link";
export default function Home() {
    return (
        <main>
            <div className={"Headers"}>

            </div>
            <h1 className={"falling-text"}>
                <span>
                    D
                </span>
                <span>
                    App
                </span>
                <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;(去中心化應用程序)
                </span>
            </h1>
            <div className={"Blocks"}>
                <Link href={"/BlockChain"} className={"Block"}>
                    <h2 className={"BlockTitle"}>區塊鏈</h2>
                    <div className={"BlockInfo"}>
                        區塊鏈：分散數據庫，保證安全和不可變性，用於加密貨幣、合同、供應鏈等。<br/><br/><p>查看更多</p>
                    </div>
                </Link>
                <div className={"Chain"}></div>
                <Link href={"/Contract"} className={"Block"}>
                    <h2 className={"BlockTitle"}>智能合約</h2>
                    <div className={"BlockInfo"}>
                        智能合約是自動執行的數位合約，基於區塊鏈，無需中介，實現安全、透明的交易和條件履行。<br/><br/><p>查看更多</p>
                    </div>
                </Link>
                <div className={"Chain"}></div>
                <Link href={"/DApp"} className={"Block"}>
                    <h2 className={"BlockTitle"}>去中心化應用程序</h2>
                    <div className={"BlockInfo"}>
                        去中心化應用程序（DApp）是基於區塊鏈的應用，無需中央控制，實現分散運行和數據安全。<br/><br/><p>查看更多</p>
                    </div>
                </Link>
            </div>
            <div>

            </div>
        </main>
    )
}
