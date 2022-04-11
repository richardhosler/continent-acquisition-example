import Modal from "react-modal";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
import africaImage from "../public/images/africa.jpg";
import asiaImage from "../public/images/asia.jpg";
import europeImage from "../public/images/europe.jpg";
import northAmericaImage from "../public/images/north-america.jpg";
import southAmericaImage from "../public/images/south-america.jpg";
import oceaniaImage from "../public/images/oceania.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { CountryDataView } from "../components/CountryData";
import { useQuery } from "react-query";
import { getContinentName } from "../utils/getContinentName";
import { CountryInterface } from "../utils/restCountriesUtils";
import { twMerge } from "tailwind-merge";
import chevron from "../assets/icons/chevron.svg";
import { MouseEventHandler } from "react";
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
  const contract = {
    addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    contractInterface: continentToken.abi,
    signerOrProvider: provider,
  };
  const [
    { data: continentData, error: continentError, loading: continentLoading },
    readContinents,
  ] = useContractRead(contract, "allContinentsStatus", { skip: true });
  const [{ data: priceData, error: priceError }, readPrice] = useContractRead(
    contract,
    "getCurrentPrice",
    { skip: true }
  );
  const [{ error: relinquishContinentError }, relinquishContinentCall] =
    useContractWrite(contract, "relinquishContinent");
  const [{ error: transferContinentError }, transferContinentCall] =
    useContractWrite(contract, "transferContinent");
  const [{ error: acquireContinentError }, acquireContractCall] =
    useContractWrite(contract, "acquireContinent");
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
    toast.error("Disconnected.");
  };

  const handleSwitchNetwork = (chainId: number) => {
    switchNetwork && switchNetwork(chainId);
  };
  const flavourText = (ISO: string) => {
    switch (ISO) {
      case "AF":
        return "Africa is the largest of the three great southward projections from the largest landmass of the Earth. Separated from Europe by the Mediterranean Sea, it is joined to Asia at its northeast extremity by the Isthmus of Suez.";
      case "AS":
        return "Asia is the largest continent on Earth, at 9% of the Earth's total surface area, and has the longest coastline, at 62,800 kilometres. It is located to the east of the Suez Canal and the Ural Mountains, and south of the Caucasus Mountains and the Caspian and Black Seas.";
      case "EU":
        return "Europe has a higher ratio of coast to landmass than any other continent or subcontinent. Its maritime borders consist of the Arctic Ocean to the north, the Atlantic Ocean to the west and the Mediterranean, Black and Caspian Seas to the south.";
      case "NA":
        return "North America occupies the northern portion of the landmass generally referred to as the New World, the Western Hemisphere, the Americas, or simply America. North America is the third-largest continent by area, following Asia and Africa.";
      case "SA":
        return "South America occupies the southern portion of the Americas. The continent is generally delimited on the northwest by the Darién watershed along the Colombia–Panama border, although some may consider the border instead to be the Panama Canal.";
      case "OC":
        return "Under a standard four region model, the major islands of Oceania extend to New Guinea in the west, the Bonin Islands in the northwest, the Hawaiian Islands in the northeast, Easter Island and Sala y Gómez Island in the east, and Macquarie Island in the south.";
      default:
        return "";
    }
  };
  useEffect(() => {
    if (connectData.connected) {
      readContinents();
      readPrice();
    }
  }, [connectData.connected, transactionData, readContinents, readPrice]);
  const getCoverImage = (ISO: string): StaticImageData | string => {
    const continentId = getContinentId(ISO);
    switch (continentId) {
      case 0:
        return africaImage;
      case 1:
        return asiaImage;
      case 2:
        return europeImage;
      case 3:
        return northAmericaImage;
      case 4:
        return southAmericaImage;
      case 5:
        return oceaniaImage;
      default:
        return " ";
    }
  };
  const fetchURL = `https://restcountries.com/v3.1/region/${getContinentName({
    continentSelected,
  })}`;

  const { data } = useQuery<CountryInterface[], Error>(
    ["Region", continentSelected],
    () => fetch(fetchURL).then((res) => res.json())
  );

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
    prevArrow: (
      <PrevArrow className="bg-slate-900 text-lg text-slate-100 z-10 left-5" />
    ),
  };

  return accountLoading || networkLoading || continentLoading ? (
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
        handleTooltipChange={handleTooltipChange}
      />
      {connectData.connected && continentData && (
        <MapChart
          setContinent={setContinent}
          setIsOpen={setIsOpen}
          onTooltipChange={handleTooltipChange}
          contractData={continentData}
          accountData={accountData}
          readContractData={readContinents}
        />
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        onAfterOpen={() => ReactTooltip.rebuild()}
        contentLabel="Modal"
        className="w-3/6 absolute left-1/4 top-1/4 bg-slate-100 rounded-lg shadow-lg max-h-80 overflow-hidden"
      >
        <Slider {...sliderSettings}>
          <div>
            <div className="grid grid-flow-row-dense grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-l-lg">
                <ContinentInfo
                  continentSelected={continentSelected}
                  className="z-10 p-6 relative bg-opacity-60 bg-slate-900 text-stone-100 inset-0"
                />
                <Image
                  layout="fill"
                  className="object-center object-cover pointer-events-none"
                  src={getCoverImage(continentSelected)}
                  alt={`an image from ${continentSelected}`}
                />
              </div>

              <div className="flex flex-col place-content-between p-6">
                <div>
                  Owner:&nbsp;&nbsp;
                  <Address
                    text={getOwnerAddress(continentSelected)}
                    handleTooltipChange={handleTooltipChange}
                  />
                </div>
                {getOwnerAddress(continentSelected) ===
                  "0x0000000000000000000000000000000000000000" && (
                  /* continent is not owned */
                  <div>
                    <div className="text-justify mb-6">
                      {flavourText(continentSelected)}
                    </div>
                    <Button
                      className="bg-lime-600 hover:bg-lime-400 text-white font-bold py-2 px-4 float-right"
                      onClick={async () =>
                        callAcquireContinent(continentSelected, priceData)
                      }
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
                {continentSelected &&
                  getOwnerAddress(continentSelected).toString() ===
                    accountData?.address && (
                    /* you own continent */
                    <div className="">
                      <div className="text-justify mb-6">
                        You own this continent, you can interact with it below.
                      </div>
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
                              <div className="text-red-600 inline-block">
                                &nbsp;&nbsp;
                                {props.errors.address && props.errors.address}
                              </div>
                              <div className="space-x-2 align-text-top">
                                <span className="rounded overflow-clip p-1">
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
                        className="float-right bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-8"
                        onClick={() =>
                          callRelinquishContinent(continentSelected)
                        }
                      >
                        Relinquish
                      </Button>
                    </div>
                  )}
                {continentSelected &&
                  getOwnerAddress(continentSelected).toString() !==
                    accountData?.address &&
                  getOwnerAddress(continentSelected).toString() !==
                    "0x0000000000000000000000000000000000000000" && (
                    /* continent owned by elseone */
                    <div className="mb-6">
                      This continent has been purchased by <br />
                      <span className="text-xs">
                        {getOwnerAddress(continentSelected)}
                      </span>
                      <br />
                      if you don&apos;t recognise this address consider another
                      continent.
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* Second slide */}
          {data && <CountryDataView data={data} />}
        </Slider>
      </Modal>
      <Notifications
        errors={[
          connectError,
          networkError,
          accountError,
          continentError,
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
