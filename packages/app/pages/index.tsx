import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import toast from "react-hot-toast";
import ReactTooltip from "react-tooltip";
import Map from "../components/Map";
import {
  Connector,
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useNetwork,
  useProvider,
  useWaitForTransaction,
} from "wagmi";
import continentToken from "../../contract/build/ContinentToken.json";
import { gweiFormatter } from "../utils/gweiFormatter";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getContinentName } from "../utils/getContinentData";
import colors from "tailwindcss/colors";
import "regenerator-runtime/runtime";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ContinentModal } from "../components/ContinentModal";
import Head from "next/head";

const Home: NextPage = () => {
  const provider = useProvider();
  const getContractAddress = (): string => {
    if (provider.network) {
      switch (provider.network.chainId) {
        case 4:
          return "0xE5047b2c151076Ec2eC43Cc532DA770f00512ddE";
        case 42:
          return "0x8f26c90699dD54A93931F2344C6f973D3052983b";
      }
    }
    return "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  };
  const contract = {
    addressOrName: getContractAddress(),
    contractInterface: continentToken.abi,
    signerOrProvider: provider,
  };
  const [tooltipContent, setTooltipContent] = useState("");
  const [continentSelected, setContinent] = useState("");
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: networkData, error: networkError }, switchNetwork] =
    useNetwork();
  const [{ data: accountData, error: accountError }, disconnect] = useAccount();
  const [{ data: continentData, error: continentError }, readContinents] =
    useContractRead(contract, "allContinentsStatus", { skip: true });
  const [{ data: priceData, error: priceError }, readPrice] = useContractRead(
    contract,
    "getCurrentPrice",
    { skip: true }
  );
  const [
    { error: relinquishContinentError, loading: relinquishContinentLoading },
    relinquishContinentCall,
  ] = useContractWrite(contract, "relinquishContinent");
  const [
    { error: transferContinentError, loading: tranferContinentLoading },
    transferContinentCall,
  ] = useContractWrite(contract, "transferContinent");
  const [
    { error: acquireContinentError, loading: aquireContractLoading },
    acquireContractCall,
  ] = useContractWrite(contract, "acquireContinent");
  const [
    {
      data: transactionData,
      loading: transactionLoading,
      error: transactionError,
    },
    wait,
  ] = useWaitForTransaction({ skip: true });
  const isSubmissionDisabled = useMemo(
    () =>
      aquireContractLoading ||
      tranferContinentLoading ||
      relinquishContinentLoading,
    [aquireContractLoading, relinquishContinentLoading, tranferContinentLoading]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleTooltipChange = (content: string) => {
    ReactTooltip.rebuild();
    setTooltipContent(content);
  };

  const handleConnect = (connector: Connector) => {
    connect(connector);
    toast.success(`Connected to ${connector.name}`);
  };

  const handleDisconnect = () => {
    disconnect();
    toast.error("Disconnected.");
  };
  const handleSwitchNetwork = (chainId: number) => {
    switchNetwork && switchNetwork(chainId);
  };

  const fetchURL = `https://restcountries.com/v3.1/region/${getContinentName(
    continentSelected
  )}`;

  useEffect(() => {
    if (connectData.connected) {
      readContinents();
      readPrice();
    }
  }, [
    connectData.connected,
    readContinents,
    readPrice,
    aquireContractLoading,
    relinquishContinentLoading,
    tranferContinentLoading,
  ]);
  useEffect(() => {
    if (
      !networkData.chain?.unsupported && [
        connectError,
        networkError,
        accountError,
        continentError,
        priceError,
        relinquishContinentError,
        transferContinentError,
        acquireContinentError,
        transactionError,
      ]
    ) {
      [
        connectError,
        networkError,
        accountError,
        continentError,
        priceError,
        relinquishContinentError,
        transferContinentError,
        acquireContinentError,
        transactionError,
      ].map((error) => {
        if (error?.message) {
          toast.error("Could not connect to contract.", { id: "contract" });
        }
      });
    }
    if (networkData.chain?.unsupported) {
      toast.error(
        "This network is not supported. Please switch to a supported network.",
        { id: "network" }
      );
    }
  }, [
    connectError,
    networkError,
    accountError,
    continentError,
    priceError,
    relinquishContinentError,
    transferContinentError,
    acquireContinentError,
    transactionError,
    networkData.chain?.unsupported,
  ]);

  return (
    <>
      <Head>
        <title>Continent Acquisition Example</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ReactTooltip backgroundColor={colors.slate[800]} id="floater">
        {tooltipContent}
      </ReactTooltip>
      <Header
        address={accountData?.address}
        networkData={networkData}
        connectors={connectData.connectors}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onSwitchNetwork={handleSwitchNetwork}
        currentPrice={gweiFormatter(priceData?.toString())}
      />
      <Footer />
      <Map
        setContinent={setContinent}
        setIsOpen={setIsModalOpen}
        onTooltipChange={handleTooltipChange}
        contractData={continentData}
        accountData={accountData}
      />
      <ContinentModal
        accountData={accountData}
        networkData={networkData}
        continentData={continentData}
        continentSelected={continentSelected}
        priceData={priceData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onAquireContinent={acquireContractCall}
        onRelinquishContinent={relinquishContinentCall}
        onTransferContinent={transferContinentCall}
        onWait={wait}
        isSubmissionDisabled={isSubmissionDisabled}
      />
    </>
  );
};

export default Home;
