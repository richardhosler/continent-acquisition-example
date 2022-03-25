import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import type { NextPage } from 'next'
import "regenerator-runtime/runtime";
import MapChart from "../components/MapChart";
import PageHeader from "../components/Header";
import { Connector, InjectedConnector, useAccount, useConnect, useContractRead, useNetwork, useProvider } from "wagmi";
import continentToken from "../../contract/build/ContinentToken.json"
import { useToasts } from "react-toast-notifications";
import Button from "../components/Button";
const Home: NextPage = () => {
  const provider = useProvider();
  const [content, setContent] = useState("");
  const { addToast } = useToasts();
  const [renderReady, setRenderReady] = useState(false);
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: networkData, error: networkError, loading: networkLoading }, switchNetwork] = useNetwork();
  const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount({ fetchEns: true });
  const [{ data: contractData, error: contractError, loading: contractLoading }, readContinents] = useContractRead({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "allContinentsStatus", { skip: true });
  const connector = new InjectedConnector({
    chains: [{
      id: 31337,
      name: 'hardhat',
      testnet: true,
      rpcUrls: ['http://localhost:8545']
    }],
    options: { shimDisconnect: true },
  })

  const handleContentChange = (content: string) => {
    setContent(content);
  }

  const handleConnect = (connector: Connector) => {
    connect(connector);
    addToast('Connected to Metamask', { appearance: 'success' })
  }

  const handleDisconnect = () => {
    disconnect();
    addToast('Disconnected.', { appearance: 'info' })
  }
  const handleSwitchNetwork = (chainId: number) => {
    switchNetwork && switchNetwork(chainId);
  }
  useEffect(() => {
    setRenderReady(true);
  }, []);

  useEffect(() => {
    if (connectData.connected) {
      readContinents();
    }
  }, [connectData.connected, readContinents])

  useEffect(() => {
    const errors = [connectError, networkError, accountError, contractError].map(error => {
      if (error?.message) {
        addToast(error.message, { appearance: 'error', autoDismiss: true })
      }
    });
  }, [connectError, networkError, accountError, contractError, addToast])

  return accountLoading || networkLoading || contractLoading ? <>Loading...</> : (
    <>
      <PageHeader
        address={accountData?.address}
        networkData={networkData}
        connectors={connectData.connectors}
        handleConnect={handleConnect}
        handleDisconnect={handleDisconnect}
        handleSwitchNetwork={handleSwitchNetwork}
      />
      {/* <div className="flex flex-col columns-1">
        {networkData.chain?.name ?? networkData.chain?.id}{' '}
        {networkData.chain?.unsupported && '(unsupported)'}
      </div> */}
      <Button onClick={() => handleConnect(connector)}>Force Connect</Button>
      <Button onClick={() => readContinents()}>Fetch Map Data</Button>


      {connectError && <div>{connectError?.message}</div>}
      <div>
        {connectData.connected && contractData && <MapChart onTooltipChange={handleContentChange} onContractChange={readContinents} contractData={contractData} accountData={accountData} readContractData={readContinents} />}
        {renderReady && <ReactTooltip>{content}</ReactTooltip>}
      </div>
    </>
  );
}

export default Home
