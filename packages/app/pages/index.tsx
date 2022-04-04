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
import { gweiFormatter } from "../utils/gweiFormatter";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Address } from "../components/Address";
import { Notifications } from "../components/Notifications";
import { ContinentInfo } from "../components/ContinentInfo";
interface Values {
  address: string;
}
const Home: NextPage = () => {
  const provider = useProvider();
  const [tooltipContent, setTooltipContent] = useState("");
  const [continentSelected, setContinent] = useState("");
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [
    { data: networkData, error: networkError, loading: networkLoading },
    switchNetwork,
  ] = useNetwork();
  const [
    { data: accountData, error: accountError, loading: accountLoading },
    disconnect,
  ] = useAccount();
  const [
    { data: contractData, error: contractError, loading: contractLoading },
    readContinents,
  ] = useContractRead(
    {
      addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contractInterface: continentToken.abi,
      signerOrProvider: provider,
    },
    "allContinentsStatus",
    { skip: true }
  );
  const [{ data: priceData, error: priceError }, readPrice] = useContractRead(
    {
      addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contractInterface: continentToken.abi,
      signerOrProvider: provider,
    },
    "getCurrentPrice",
    { skip: true }
  );
  const [{ error: relinquishContinentError }, relinquishContinentCall] =
    useContractWrite(
      {
        addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        contractInterface: continentToken.abi,
        signerOrProvider: provider,
      },
      "relinquishContinent"
    );
  const [{ error: transferContinentError }, transferContinentCall] =
    useContractWrite(
      {
        addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        contractInterface: continentToken.abi,
        signerOrProvider: provider,
      },
      "transferContinent"
    );
  const [{ error: acquireContinentError }, acquireContractCall] =
    useContractWrite(
      {
        addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        contractInterface: continentToken.abi,
        signerOrProvider: provider,
      },
      "acquireContinent"
    );
  const [{ data: transactionData, error: transactionError }, wait] =
    useWaitForTransaction({ skip: true });

  const [modalIsOpen, setIsOpen] = useState(false);

  const schema = object({
    address: string()
      .trim()
      .matches(/^0x[0-9a-f]{40}$/i, "Invalid Etherium address.")
      .test(
        "isYours",
        "You already own this.",
        (value) => value !== accountData?.address
      )
      .required(),
  });
  const handleTooltipChange = (content: string) => {
    setTooltipContent(content);
  };
  const getOwnerAddress = (ISO: string): string => {
    return getContinentId(ISO) != -1 && contractData
      ? contractData[getContinentId(ISO)][1]
      : undefined;
  };
  const handleConnect = (connector: Connector) => {
    connect(connector);
    toast.success(`Connected to ${connector.name}`);
  };
  const callAcquireContinent = async (
    ISO: string,
    price: Result | undefined
  ) => {
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
    if (connectData.connected) {
      readContinents();
      readPrice();
    }
  }, [connectData.connected, transactionData, readContinents, readPrice]);

  Modal.setAppElement("#__next");
  const modalStyle = {
    content: {
      top: "25%",
      left: "40%",
      right: "40%",
      bottom: "25%",
      marginRight: "-25%",
      transform: "translate(-25%, -10%)",
      borderRadius: "10px",
      padding: "40px",
      backgroundColor: "#F1F5FF",
      border: "2px solid #525252",
      overflow: "hidden",
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
      <div id="mroot" className="flex w-2/4 h-2/3">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Modal"
          style={modalStyle}
        >
          <div className="flex place-content-end relative -top-5 -right-5">
            <Button
              className="font-semibold px-2 py-0 text-lg"
              onClick={() => setIsOpen(false)}
            >
              X
            </Button>
          </div>
          <ContinentInfo
            continentSelected={continentSelected}
            className="float-left relative -top-10"
          />
          <div className="float-right py-10">
            <div className="float-right">
              Owner:&nbsp;
              <Address
                text={getOwnerAddress(continentSelected)}
                handleTooltipChange={handleTooltipChange}
              />
            </div>
            {getOwnerAddress(continentSelected) /* continent is not owned */ ===
              "0x0000000000000000000000000000000000000000" && (
              <div className="pt-10">
                <Button
                  className="bg-lime-600 hover:bg-lime-400 text-white font-bold py-2 px-4 rounded"
                  onClick={async () =>
                    callAcquireContinent(continentSelected, await priceData)
                  }
                >
                  Buy Now!
                </Button>
                &nbsp;&nbsp;
                <span className="align-bottom">
                  <span className="text-4xl">
                    {gweiFormatter(priceData?.toString()).amount}
                  </span>
                  &nbsp;&nbsp;
                  {gweiFormatter(priceData?.toString()).symbol}
                </span>
              </div>
            )}
            {getOwnerAddress(
              continentSelected
            ).toString() /* you own continent */ === accountData?.address && (
              <div className="py-5">
                <Formik
                  initialValues={{
                    address: "",
                  }}
                  onSubmit={(
                    values: Values,
                    { setSubmitting }: FormikHelpers<Values>
                  ) => {
                    () => {
                      if (accountData) {
                        callTransferContinent(
                          accountData.address,
                          values.address,
                          continentSelected
                        );
                      }
                      setSubmitting(false);
                    };
                  }}
                  validationSchema={schema}
                >
                  {(props) => {
                    return (
                      <Form>
                        <div className="text-red-600 inline-block pt-5">
                          &nbsp;&nbsp;
                          {props.errors.address && props.errors.address}
                        </div>
                        <div className="space-x-2 align-text-top">
                          <span className="border-2 border-gray-900 rounded overflow-clip p-1">
                            <Field
                              id="address"
                              name="address"
                              placeholder="recipient address..."
                            />
                          </span>
                          <Button
                            type="submit"
                            disabled={!(props.isValid && props.dirty)}
                          >
                            Transfer
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
                <Button
                  className="float-right bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-10"
                  onClick={() => callRelinquishContinent(continentSelected)}
                >
                  Relinquish
                </Button>
              </div>
            )}
          </div>
        </Modal>
      </div>
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
