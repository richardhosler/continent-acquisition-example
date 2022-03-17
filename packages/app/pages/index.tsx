import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import type { NextPage } from 'next'
import "regenerator-runtime/runtime";
import MapChart from "./components/MapChart";
import { useAccount, useBalance, useConnect, useContract, useNetwork } from "wagmi";
import continentToken from "../../contract/build/ContinentToken.json"

const Home: NextPage = () => {
  const [content, setContent] = useState("");
  const [{ data, error }, connect] = useConnect();
  const [{ data: networkData, error: networkError, loading: networkLoading }, switchNetwork] = useNetwork()
  const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount({ fetchEns: true });
  const [{ data: balanceData, error: balanceError, loading: balanceLoading }] = useBalance({ addressOrName: accountData?.address });
  const contract = useContract({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi })
  // console.log(contract.allContinentsStatus());

  return accountLoading || networkLoading || balanceLoading ? <>Loading...</> : (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-100">
      <div className="absolute top-10 right-10">
        {data.connectors.map((connector) => {
          return (
            <button
              {...!connector.ready && 'disabled'}
              key={connector.id}
              onClick={() => connect(connector)}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
            </button>
          )
        })}
        {accountData?.address}
        {error && <div>{error?.message ?? 'Failed to connect'}</div>}
      </div>
      <div>
        {networkData.chain?.name ?? networkData.chain?.id}{' '}
        {networkData.chain?.unsupported && '(unsupported)'}
      </div>

      {switchNetwork &&
        networkData.chains.map((x) =>
          x.id === networkData.chain?.id ? null : (
            <button key={x.id} onClick={() => switchNetwork(x.id)}>
              Switch to {x.name}
            </button>
          ),
        )}

      {error && <div>{error?.message}</div>}
      <div className="flex">
        <MapChart setTooltipContent={setContent} />
        <ReactTooltip>{content}</ReactTooltip>
      </div>
    </div>
  );
}

export default Home
