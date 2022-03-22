import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import type { NextPage } from 'next'
import "regenerator-runtime/runtime";
import MapChart from "../components/MapChart";
import { useAccount, useBalance, useConnect, useContract, useContractRead, useContractWrite, useNetwork, useProvider } from "wagmi";
import continentToken from "../../contract/build/ContinentToken.json"
import { Signer } from "ethers";

const Home: NextPage = () => {
  const provider = useProvider();
  const [content, setContent] = useState("");
  const [{ data, error }, connect] = useConnect();
  const [{ data: networkData, error: networkError, loading: networkLoading }, switchNetwork] = useNetwork();
  const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount({ fetchEns: true });
  const [{ data: contractData, error: contractError, loading: contractLoading }, readContinents] = useContractRead({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "allContinentsStatus", { skip: true });

  const handleContentChange = (content: string) => {
    setContent(content);
  }

  return accountLoading || networkLoading || contractLoading ? <>Loading...</> : (
    <div className="flex flex-col py-2 bg-slate-100 columns-3">
      <div className="flex flex-col columns-1">
        {accountData?.address == null ?
          data.connectors.map((connector) => {
            <button
              {...!connector.ready && 'disabled'}
              key={connector.id}
              onClick={() => connect(connector)}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
            </button>
          }) : <button onClick={() => disconnect()}>Disconnect</button>
        }
        {error && <div>{error?.message ?? 'Failed to connect'}</div>}
      </div>
      <div className="flex flex-col columns-1">
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

      <button onClick={() => readContinents()}>
        Fetch Map Data
      </button>


      {error && <div>{error?.message}</div>}
      <div className="flex flex-col columns-3">
        {data.connected && contractData && <MapChart onTooltipChange={handleContentChange} contractData={contractData} accountData={accountData} />}
        <ReactTooltip>{content}</ReactTooltip>
      </div>
    </div>
  );
}

export default Home
