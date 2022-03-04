import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ThirdwebWeb3Provider, useWeb3 } from "@3rdweb/hooks";
import "regenerator-runtime/runtime";

const Home: NextPage = () => {

  // Connector for MM
  const { connectWallet, address, error } = useWeb3();
  error ? console.log(error) : null;
  // Import web3 lib
  // Observe/watch for connect/login


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-100">
      <div className="absolute top-10 right-10">
        {address ? (
          <p className="px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 font-mono font-medium cursor-pointer duration-100">
            {address}
          </p>
        ) : (
          <button
            className="px-4 py-2 rounded-md bg-purple-600 cursor-pointer hover:bg-purple-500 text-xl font-semibold duration-100 text-white"
            onClick={() => connectWallet("injected")}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );

}

export default Home
