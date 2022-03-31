import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MapChart from "../components/MapChart";
import { Result } from "ethers/lib/utils";
import ReactTooltip from "react-tooltip";
import "regenerator-runtime/runtime";
import { object, string } from "yup";
import type { NextPage } from "next";
import { Field, Form, Formik, FormikHelpers } from "formik";
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
import { convertStringToByteArray } from "../utils/convertStringToByteArray";
import { getContinentId } from "../utils/getContinentId";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Notifications } from "../components/Notifications";
import { ContinentInfo } from "../components/ContinentInfo";
import { Address } from "../components/Address";
import { gweiFormatter } from "../utils/gweiFormatter";
interface Values {
  address: string;
}
const Home: NextPage = () => {
  const provider = useProvider();
  const [tooltipContent, setTooltipContent] = useState("");
  const [continentSelected, setContinent] = useState("");
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: networkData, error: networkError, loading: networkLoading }, switchNetwork] = useNetwork();
  const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();
  const [{ data: contractData, error: contractError, loading: contractLoading }, readContinents] = useContractRead(
    {
      addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contractInterface: continentToken.abi,
      signerOrProvider: provider,
    },
    "allContinentsStatus",
    { skip: true }
  );
  const [{ data: priceData, error: priceError, loading: priceLoading }, readPrice] = useContractRead(
    {
      addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contractInterface: continentToken.abi,
      signerOrProvider: provider,
    },
    "getCurrentPrice",
    { skip: true }
  );
  const [
    { data: relinquishContinentData, error: relinquishContinentError, loading: relinquishContinentLoading },
    relinquishContinentCall,
  ] = useContractWrite(
    {
      addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contractInterface: continentToken.abi,
      signerOrProvider: provider,
    },
    "relinquishContinent"
  );
  const [
    { data: transferContinentData, error: transferContinentError, loading: transferContinentLoading },
    transferContinentCall,
  ] = useContractWrite(
    {
      addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contractInterface: continentToken.abi,
      signerOrProvider: provider,
    },
    "transferContinent"
  );
  const [
    { data: acquireContinentData, error: acquireContinentError, loading: acquireContinentLoading },
    acquireContractCall,
  ] = useContractWrite(
    {
      addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contractInterface: continentToken.abi,
      signerOrProvider: provider,
    },
    "acquireContinent"
  );
  const [{ data: transactionData, error: transactionError, loading: transactionLoading }, wait] = useWaitForTransaction(
    { skip: true }
  );

  const [modalIsOpen, setIsOpen] = useState(false);

  const schema = object({
    address: string()
      .trim()
      .matches(/^0x[0-9a-f]{40}$/i, "Invalid Etherium address.")
      .test("isYours", "You already own this.", (value) => value !== accountData?.address)
      .required(),
  });
  Modal.setAppElement("#__next");
  const handleTooltipChange = (content: string) => {
    setTooltipContent(content);
  };
  const getOwnerAddress = (ISO: string): string => {
    return getContinentId(ISO) != -1 && contractData ? contractData[getContinentId(ISO)][1] : undefined;
  };
  const handleConnect = (connector: Connector) => {
    connect(connector);
    toast.success(`Connected to ${connector.name}`);
  };
  const callAcquireContinent = async (ISO: string, price: Result | undefined) => {
    const transaction = await acquireContractCall({
      args: convertStringToByteArray({ s: ISO }),
      overrides: { from: accountData?.address, value: price },
    });
    if (transaction.data?.hash) {
      wait({ hash: transaction.data.hash });
    }
  };
  const callRelinquishContinent = (ISO: string) => {
    relinquishContinentCall({ args: convertStringToByteArray({ s: ISO }) });
  };
  const callTransferContinent = (from: string, to: string, ISO: string) => {
    transferContinentCall({
      args: [from, to, convertStringToByteArray({ s: ISO })],
    });
  };
  const handleDisconnect = () => {
    disconnect();
    toast("Disconnected.");
  };

  const handleSwitchNetwork = (chainId: number) => {
    switchNetwork && switchNetwork(chainId);
  };

  useEffect(() => {
    if (connectData.connected || transactionData) {
      readContinents();
      readPrice();
    }
  }, [connectData.connected, transactionData, readContinents, readPrice]);

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "25%",
      bottom: "auto",
      marginRight: "-25%",
      transform: "translate(-50%, -50%)",
    },
  };

  return accountLoading || networkLoading || contractLoading ? (
    <>Loading...</>
  ) : (
    <>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <Header
        address={accountData?.address}
        networkData={networkData}
        connectors={connectData.connectors}
        handleConnect={handleConnect}
        handleDisconnect={handleDisconnect}
        handleSwitchNetwork={handleSwitchNetwork}
        // handleTooltipChange={handleTooltipChange}
      />
      {connectData.connected && contractData && (
        <div className="overflow-hidden w-screen h-screen">
          <MapChart
            setContinent={setContinent}
            setIsOpen={setIsOpen}
            onTooltipChange={handleTooltipChange}
            contractData={contractData}
            accountData={accountData}
            readContractData={readContinents}
          />
        </div>
      )}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Modal" style={modalStyle}>
        <div className="flex place-content-end">
          <Button onClick={() => setIsOpen(false)}>close</Button>
        </div>
        <ContinentInfo continentSelected={continentSelected} className="float-left" />
        <div className="float-right">
          <div>
            Owner:
            <Address text={getOwnerAddress(continentSelected)} />
          </div>
          <div>Price: {gweiFormatter(priceData?.toString())}</div>
          {getOwnerAddress(continentSelected) != accountData?.address ? (
            <Button onClick={async () => callAcquireContinent(continentSelected, await priceData)}>Purchase</Button>
          ) : (
            <>
              <Button onClick={() => callRelinquishContinent(continentSelected)}>Relinquish</Button>
              <Formik
                initialValues={{
                  address: "",
                }}
                onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
                  () => {
                    if (accountData) {
                      callTransferContinent(accountData.address, values.address, continentSelected);
                    }
                    setSubmitting(false);
                  };
                }}
                validationSchema={schema}
              >
                {(props) => {
                  return (
                    <Form>
                      <Field id="address" name="address" placeholder="" />
                      {props.errors.address && props.errors.address}
                      <Button type="submit" disabled={!(props.isValid && props.dirty)}>
                        Transfer
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </div>
      </Modal>
      <Notifications
        errors={[
          connectError,
          networkError,
          accountError,
          contractError,
          priceError,
          relinquishContinentError,
          transferContinentError,
          acquireContinentError,
          transactionError,
        ]}
      />
    </>
  );
};

export default Home;
