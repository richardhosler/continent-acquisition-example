import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Modal from "react-modal";
import toast from "react-hot-toast";
import ReactTooltip from "react-tooltip";
import MapChart from "../components/MapChart";
import { Result } from "ethers/lib/utils";
import { object, string } from "yup";
import Swal from "sweetalert2";
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
import Slider from "react-slick";
import { MouseEventHandler } from "react";
import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import continentToken from "../../contract/build/ContinentToken.json";
import chevron from "../assets/icons/chevron.svg";
import { gweiFormatter } from "../utils/gweiFormatter";
import { truncateString } from "../utils/truncateString";
import { CountryInterface } from "../utils/restCountriesInterface";
import { convertStringToByteArray } from "../utils/convertStringToByteArray";
import { Address } from "../components/Address";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { CountryDataView } from "../components/CountryData";
import { ContinentInfo } from "../components/ContinentInfo";
import { Footer } from "../components/Footer";
import {
  getContinentId,
  getContinentName,
  getCoverImage,
  flavourText,
} from "../utils/getContinentData";
import colors from "tailwindcss/colors";
import "regenerator-runtime/runtime";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Loading } from "../components/Loading";

enum Status {
  OwnedByYou,
  OwnedBySomeoneElse,
  Unowned,
}
interface Values {
  address: string;
}
const Home: NextPage = () => {
  const provider = useProvider();
  const contract = {
    addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    contractInterface: continentToken.abi,
    signerOrProvider: provider,
  };
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
    { data: continentData, error: continentError, loading: continentLoading },
    readContinents,
  ] = useContractRead(contract, "allContinentsStatus", { skip: true });
  const [
    { data: priceData, loading: priceLoading, error: priceError },
    readPrice,
  ] = useContractRead(contract, "getCurrentPrice", { skip: true });
  const [{ error: relinquishContinentError }, relinquishContinentCall] =
    useContractWrite(contract, "relinquishContinent");
  const [{ error: transferContinentError }, transferContinentCall] =
    useContractWrite(contract, "transferContinent");
  const [{ error: acquireContinentError }, acquireContractCall] =
    useContractWrite(contract, "acquireContinent");
  const [
    {
      data: transactionData,
      loading: transactionLoading,
      error: transactionError,
    },
    wait,
  ] = useWaitForTransaction({ skip: true });
  const { data } = useQuery<CountryInterface[], Error>(
    ["Region", continentSelected],
    () => fetch(fetchURL).then((res) => res.json())
  );
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleTooltipChange = (content: string) => {
    ReactTooltip.rebuild();
    setTooltipContent(content);
  };
  const getOwnerAddress = (ISO: string): string => {
    return getContinentId(ISO) != -1 && continentData
      ? continentData[getContinentId(ISO)][1]
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
    Swal.fire({
      text: `Are you sure buying ${getContinentName(
        continentSelected
      )} will cost you ${gweiFormatter(priceData?.toString()).amount} ${
        gweiFormatter(priceData?.toString()).symbol
      }!`,
      confirmButtonText: "Yes, acquire it.",
      showCancelButton: true,
      background: colors.slate[100],
      backdrop: `${colors.slate[400]}80`,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "inline-flex text-slate-100 bg-lime-700 hover:bg-lime-600 focus:bg-lime-500 disabled:bg-stone-700 font-medium rounded-sm text-sm px-3 py-2 space-x-2 mx-2",
        cancelButton:
          "inline-flex text-slate-100 bg-red-700 hover:bg-red-600 focus:bg-red-500 disabled:bg-stone-700 font-medium rounded-sm text-sm px-3 py-2 space-x-2",
      },
    }).then(async (result) => {
      if (result.value) {
        const transaction = await acquireContractCall({
          args: convertStringToByteArray({ s: ISO }),
          overrides: { from: accountData?.address, value: price },
        });
        if (transaction.data?.hash) {
          wait({ hash: transaction.data.hash });
        }
      } else {
        setSubmitDisabled(false);
      }
    });
  };
  const callRelinquishContinent = async (ISO: string) => {
    Swal.fire({
      text: "You will lose ownership of this continent, this action cannot be undone.",
      confirmButtonText: "Yes, get rid of it!",
      showCancelButton: true,
      background: colors.slate[100],
      backdrop: `${colors.slate[400]}80`,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "inline-flex text-slate-100 bg-lime-700 hover:bg-lime-600 focus:bg-lime-500 disabled:bg-stone-700 font-medium rounded-sm text-sm px-3 py-2 space-x-2 mx-2",
        cancelButton:
          "inline-flex text-slate-100 bg-red-700 hover:bg-red-600 focus:bg-red-500 disabled:bg-stone-700 font-medium rounded-sm text-sm px-3 py-2 space-x-2",
      },
    }).then(async (result) => {
      if (result.value) {
        const transaction = await relinquishContinentCall({
          args: convertStringToByteArray({ s: ISO }),
        });
        if (transaction.data?.hash) {
          wait({ hash: transaction.data.hash });
        }
      } else {
        setSubmitDisabled(false);
      }
    });
  };
  const callTransferContinent = async (
    from: string,
    to: string,
    ISO: string
  ) => {
    Swal.fire({
      text: `Are you sure? ${truncateString({
        text: to,
      })} will become the new owner of ${getContinentName(
        continentSelected
      )}. This action cannot be undone.`,
      confirmButtonText: "Yes, transfer it.",
      showCancelButton: true,
      background: colors.slate[100],
      backdrop: `${colors.slate[400]}80`,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "inline-flex text-slate-100 bg-lime-700 hover:bg-lime-600 focus:bg-lime-500 disabled:bg-stone-700 font-medium rounded-sm text-sm px-3 py-2 space-x-2 mx-2",
        cancelButton:
          "inline-flex text-slate-100 bg-red-700 hover:bg-red-600 focus:bg-red-500 disabled:bg-stone-700 font-medium rounded-sm text-sm px-3 py-2 space-x-2",
      },
    }).then(async (result) => {
      if (result.value) {
        const transaction = await transferContinentCall({
          args: [from, to, convertStringToByteArray({ s: ISO })],
        });
        if (transaction.data?.hash) {
          wait({ hash: transaction.data.hash });
        }
      } else {
        setSubmitDisabled(false);
      }
    });
  };
  const handleDisconnect = () => {
    disconnect();
    toast.error("Disconnected.");
  };
  const handleSwitchNetwork = (chainId: number) => {
    switchNetwork && switchNetwork(chainId);
  };
  const getContinentStatus = (continent: string): Status => {
    if (
      getOwnerAddress(continent) ===
      "0x0000000000000000000000000000000000000000"
    ) {
      return Status.Unowned;
    } else if (getOwnerAddress(continent) === accountData?.address) {
      return Status.OwnedByYou;
    } else {
      return Status.OwnedBySomeoneElse;
    }
  };
  const fetchURL = `https://restcountries.com/v3.1/region/${getContinentName(
    continentSelected
  )}`;

  Modal.setAppElement("#__next");

  const NextArrow = (props: {
    className?: string;
    style?: React.CSSProperties;
    onClick?: MouseEventHandler;
  }) => {
    const { className, style, onClick } = props;

    return (
      <div
        className={twMerge(
          className,
          "bg-slate-900 text-lg text-slate-100 z-10 x-5 w-10"
        )}
        onClick={onClick}
        style={{ ...style, display: "block", background: "green" }}
      >
        <Image src={chevron} alt="next slide" />
      </div>
    );
  };

  const PrevArrow = (props: {
    className?: string;
    style?: React.CSSProperties;
    onClick?: MouseEventHandler;
  }) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={twMerge(
          className,
          "bg-slate-900 text-lg text-slate-100 z-10 x-5"
        )}
        onClick={onClick}
        style={{ ...style, display: "block", background: "green" }}
      >
        chevron
        <Image src={chevron} alt="next slide" />
      </div>
    );
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  useEffect(() => {
    if (connectData.connected) {
      readContinents();
      readPrice();
    }
    if (!transactionLoading) {
      setSubmitDisabled(false);
    }
  }, [
    connectData.connected,
    transactionData,
    readContinents,
    readPrice,
    transactionLoading,
  ]);
  useEffect(() => {
    if (
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
          console.log({ ApplicationError: error.message });
          toast.error(error.message);
        }
      });
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
  ]);

  return (
    <>
      <ReactTooltip backgroundColor={colors.slate[800]}>
        {tooltipContent}
      </ReactTooltip>
      <Header
        address={accountData?.address}
        networkData={networkData}
        connectors={connectData.connectors}
        handleConnect={handleConnect}
        handleDisconnect={handleDisconnect}
        handleSwitchNetwork={handleSwitchNetwork}
        currentPrice={gweiFormatter(priceData?.toString())}
      />
      <Footer />

      <MapChart
        setContinent={setContinent}
        setIsOpen={setModalIsOpen}
        onTooltipChange={handleTooltipChange}
        contractData={continentData}
        accountData={accountData}
        readContractData={readContinents}
      />

      <Modal
        id="modal"
        isOpen={modalIsOpen}
        shouldFocusAfterRender={true}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        onAfterOpen={() => {
          document.getElementById("modal")?.focus();
        }}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Modal"
        overlayClassName="w-screen h-screen fixed top-0 left-0 bg-slate-400 bg-opacity-60"
        className="w-3/6 absolute left-1/4 top-1/4 bg-slate-100 rounded-lg shadow-lg max-h-80 overflow-hidden"
      >
        <Slider {...sliderSettings}>
          <div>
            <div className="grid grid-flow-row-dense grid-cols-5">
              <div className="relative overflow-hidden rounded-l-lg col-span-2">
                <ContinentInfo
                  continentSelected={continentSelected}
                  className="z-10 p-6 relative bg-opacity-60 bg-slate-900 text-slate-100 inset-0"
                />
                <Image
                  layout="fill"
                  className="object-center object-cover pointer-events-none"
                  src={getCoverImage(continentSelected)}
                  alt={`an image from ${continentSelected}`}
                  priority
                />
              </div>

              <div className="flex flex-col place-content-between p-6 col-span-3">
                <div className="mb-6">{flavourText(continentSelected)}</div>
                {getContinentStatus(continentSelected) === Status.Unowned && (
                  <div>
                    <Button
                      className="bg-lime-700 hover:bg-lime-600 focus:bg-lime-500 text-slate-100 font-bold py-2 px-4 float-right"
                      onClick={async () => {
                        callAcquireContinent(continentSelected, priceData);
                        setSubmitDisabled(true);
                      }}
                      disabled={submitDisabled}
                    >
                      <div className="flex space-x-2">
                        <span className="font-normal">
                          {gweiFormatter(priceData?.toString()).amount}
                          {gweiFormatter(priceData?.toString()).symbol}
                        </span>
                        <span>BUY</span>
                      </div>
                    </Button>
                  </div>
                )}
                {getContinentStatus(continentSelected) ===
                  Status.OwnedByYou && (
                  <div className="">
                    <Formik
                      initialValues={{
                        address: "",
                      }}
                      onSubmit={(
                        values: Values,
                        { setSubmitting }: FormikHelpers<Values>
                      ) => {
                        console.log("transfer clicked");
                        if (accountData) {
                          callTransferContinent(
                            accountData.address,
                            values.address,
                            continentSelected
                          );
                        }
                        setSubmitting(false);
                      }}
                      validationSchema={schema}
                    >
                      {(props) => {
                        return (
                          <span className="flex space-x-4">
                            <Button
                              className="float-left bg-red-700 hover:bg-red-600 focus:bg-red-500 text-white"
                              onClick={() => {
                                callRelinquishContinent(continentSelected);
                                setSubmitDisabled(true);
                              }}
                              disabled={submitDisabled}
                            >
                              Relinquish
                            </Button>
                            <Form className="flex">
                              <div className="align-text-top flex place-content-between space-x-2">
                                <div className="text-red-700 absolute bottom-20 pl-4">
                                  {props.errors.address && props.errors.address}
                                </div>
                                <Field
                                  id="address"
                                  name="address"
                                  placeholder="Recipient address"
                                  className="text-slate-900 bg-white border-2 border-slate-300 rounded-sm px-2"
                                />
                                <Button
                                  type="submit"
                                  disabled={!(props.isValid && props.dirty)}
                                  className="bg-lime-700 hover:bg-lime-600 focus:bg-lime-500 text-slate-100 float-right"
                                >
                                  Transfer
                                </Button>
                              </div>
                            </Form>
                          </span>
                        );
                      }}
                    </Formik>
                  </div>
                )}
                {getContinentStatus(continentSelected) ===
                  Status.OwnedBySomeoneElse && (
                  <span>
                    <Address
                      text={getOwnerAddress(continentSelected)}
                      chainId={networkData.chain?.id}
                    />
                    <Button
                      className="bg-lime-700 hover:bg-lime-600 focus:bg-lime-500 text-slate-100 font-semibold py-2 px-4 float-right"
                      disabled={true}
                    >
                      <div className="flex space-x-2">
                        <span className="font-normal">
                          {gweiFormatter(priceData?.toString()).amount}
                          {gweiFormatter(priceData?.toString()).symbol}
                        </span>
                        <span>BUY</span>
                      </div>
                    </Button>
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Second slide */}
          {data && <CountryDataView data={data} />}
        </Slider>
      </Modal>
    </>
  );
};

export default Home;
