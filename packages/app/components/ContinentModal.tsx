import { useRef } from "react";
import Modal from "react-modal";
import { Field, Form, Formik } from "formik";
import Slider from "react-slick";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { CountryDataView } from "../components/CountryData";
import { ContinentInfo } from "../components/ContinentInfo";
import { Address } from "../components/Address";
import { Button } from "../components/Button";
import {
  flavourText,
  getContinentId,
  getContinentName,
  getCoverImage,
} from "../utils/getContinentData";
import { Result } from "ethers/lib/utils";
import continentToken from "../../contract/build/ContinentToken.json";
import { useProvider } from "wagmi";
import { gweiFormatter } from "../utils/gweiFormatter";
import colors from "tailwindcss/colors";
import Swal from "sweetalert2";
import { truncateString } from "../utils/truncateString";
import { object, string } from "yup";
import { useQuery } from "react-query";
import { CountryInterface } from "../utils/restCountriesInterface";
import ReactTooltip from "react-tooltip";
import {
  WagmiContractWriteConfig,
  WagmiContractWriteResponse,
  WagmiContractWriteResponseError,
} from "../interfaces/WagmiContractWriteInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { convertStringToByteArray } from "../utils/convertStringToByteArray";

type WagmiContractWriteType = (
  config: WagmiContractWriteConfig
) => Promise<WagmiContractWriteResponse | WagmiContractWriteResponseError>;

enum Status {
  OwnedByYou,
  OwnedBySomeoneElse,
  Unowned,
}
interface Values {
  address: string;
}
interface ContinentModalInterface {
  continentSelected: string;
  continentData: any;
  networkData: any;
  accountData: any;
  priceData: any;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  onRelinquishContinent: WagmiContractWriteType;
  onAquireContinent: WagmiContractWriteType;
  onTransferContinent: WagmiContractWriteType;
  isSubmissionDisabled: boolean | undefined;
  onWait: (response: any) => void;
}
export const ContinentModal = ({
  continentSelected,
  continentData,
  networkData,
  accountData,
  priceData,
  isModalOpen,
  setIsModalOpen,
  onWait,
  onRelinquishContinent,
  onAquireContinent,
  onTransferContinent,
  isSubmissionDisabled,
}: ContinentModalInterface) => {
  const provider = useProvider();
  const schema = object({
    address: string()
      .trim()
      .matches(/^0x[0-9a-f]{40}$/i, "Invalid Ethereum address")
      .test(
        "isYours",
        "You already own this",
        (value) => value !== accountData?.address
      )
      .required("Address is required"),
  });
  const contract = {
    addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    contractInterface: continentToken.abi,
    signerOrProvider: provider,
  };
  const fetchURL = `https://restcountries.com/v3.1/region/${getContinentName(
    continentSelected
  )}`;

  const getOwnerAddress = (iso: string): string => {
    return getContinentId(iso) != -1 && continentData
      ? continentData[getContinentId(iso)][1]
      : undefined;
  };
  const confirmButtonClass =
    "inline-flex text-slate-100 bg-lime-700 hover:bg-lime-600 disabled:bg-stone-700 font-medium rounded-sm text-sm px-3 py-2 space-x-2 mx-2";
  const cancelButtonClass =
    "inline-flex text-slate-100 bg-red-700 hover:bg-red-600 focus:bg-red-500 disabled:bg-stone-700 font-medium rounded-sm text-sm px-3 py-2 space-x-2";

  const callAcquireContinent = async (
    iso: string,
    price: Result | undefined
  ) => {
    Swal.fire({
      text: `Are you sure? Buying ${getContinentName(
        continentSelected
      )} will cost you ${gweiFormatter(priceData?.toString()).amount} ${
        gweiFormatter(priceData?.toString()).symbol
      }.`,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true,
      background: colors.slate[100],
      backdrop: `${colors.slate[400]}80`,
      buttonsStyling: false,
      customClass: {
        htmlContainer: "p-6",
        confirmButton: confirmButtonClass,
        cancelButton: cancelButtonClass,
      },
    }).then(async (result) => {
      if (result.value) {
        const transaction = await onAquireContinent({
          args: convertStringToByteArray(iso),
          overrides: { from: accountData?.address, value: price },
        });
        if (transaction.data?.hash) {
          onWait({ hash: transaction.data.hash });
        }
      }
    });
  };
  const callRelinquishContinent = async (iso: string) => {
    Swal.fire({
      text: "You will lose ownership of this continent, this action cannot be undone.",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true,
      background: colors.slate[100],
      backdrop: `${colors.slate[400]}80`,
      buttonsStyling: false,
      customClass: {
        confirmButton: confirmButtonClass,
        cancelButton: cancelButtonClass,
      },
    }).then(async (result) => {
      if (result.value) {
        const transaction = await onRelinquishContinent({
          args: convertStringToByteArray(iso),
        });
        if (transaction.data?.hash) {
          onWait({ hash: transaction.data.hash });
        }
      }
    });
  };
  const callTransferContinent = async (
    from: string,
    to: string,
    iso: string
  ) => {
    Swal.fire({
      text: `Are you sure? ${truncateString({
        text: to,
      })} will become the new owner of ${getContinentName(
        continentSelected
      )}. This action cannot be undone.`,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true,
      background: colors.slate[100],
      backdrop: `${colors.slate[400]}80`,
      buttonsStyling: false,
      customClass: {
        confirmButton: confirmButtonClass,
        cancelButton: cancelButtonClass,
      },
    }).then(async (result) => {
      if (result.value) {
        const transaction = await onTransferContinent({
          args: [from, to, convertStringToByteArray(iso)],
        });
        if (transaction.data?.hash) {
          onWait({ hash: transaction.data.hash });
        }
      }
    });
  };

  const getContinentStatus = (continent: string): Status => {
    if (
      getOwnerAddress(continent) ===
      "0x0000000000000000000000000000000000000000"
    ) {
      return Status.Unowned;
    }

    if (getOwnerAddress(continent) === accountData?.address) {
      return Status.OwnedByYou;
    }

    return Status.OwnedBySomeoneElse;
  };

  const { data } = useQuery<CountryInterface[], Error>(
    ["Region", continentSelected],
    () => fetch(fetchURL).then((res) => res.json())
  );
  const sliderRef = useRef<Slider | null>(null);
  const slickNext = () => {
    sliderRef.current?.slickNext();
  };
  const slickPrev = () => {
    sliderRef.current?.slickPrev();
  };
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  Modal.setAppElement("#__next");

  const continentStatus = getContinentStatus(continentSelected);
  const chevronClasses =
    "absolute p-1 py-4 z-50 -mt-10 top-1/2 cursor-pointer select-none text-slate-800 hover:text-slate-700";
  return (
    <div className="w-max h-max">
      {isModalOpen && (
        <>
          <div
            onClick={slickNext}
            className={twMerge(chevronClasses, "lg:right-[20%] right-0")}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
          <div
            onClick={slickPrev}
            className={twMerge(chevronClasses, "lg:left-[20%] left-0")}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
        </>
      )}
      <ReactTooltip id="error" />
      <Modal
        id="modal"
        isOpen={isModalOpen}
        shouldFocusAfterRender={true}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        onAfterOpen={() => {
          ReactTooltip.rebuild();
        }}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Modal"
        overlayClassName="w-screen h-screen fixed top-0 left-0 bg-slate-400 bg-opacity-60"
        className="w-[800px] fixed inset-0 overflow-hidden m-auto bg-slate-100 rounded-lg shadow-lg max-h-80 max-w-4xl"
      >
        <Slider {...sliderSettings} ref={sliderRef}>
          <div className="overflow-hidden rounded-lg">
            <div className="grid grid-flow-row-dense grid-cols-5">
              <div className="relative overflow-hidden rounded-l-lg col-span-2">
                <ContinentInfo
                  continentSelected={continentSelected}
                  className="z-10 p-6 relative bg-opacity-60 bg-slate-900 text-slate-100 inset-0"
                />
                <Image
                  layout="fill"
                  className="object-center object-cover pointer-events-none bg-slate-600"
                  src={getCoverImage(continentSelected)}
                  alt={`an image from ${continentSelected}`}
                  priority
                />
              </div>

              <div className="flex flex-col place-content-between p-6 col-span-3">
                <div className="mb-6">{flavourText(continentSelected)}</div>
                {accountData && continentStatus === Status.Unowned && (
                  <div>
                    <Button
                      className="bg-lime-700 hover:bg-lime-600 focus:bg-lime-500 text-slate-100 py-2 px-4 float-right"
                      onClick={async () => {
                        callAcquireContinent(continentSelected, priceData);
                      }}
                      disabled={isSubmissionDisabled}
                    >
                      <div className="flex space-x-1">
                        <span>
                          {gweiFormatter(priceData?.toString()).amount}
                        </span>
                        <span>
                          {gweiFormatter(priceData?.toString()).symbol}
                        </span>
                      </div>
                    </Button>
                  </div>
                )}
                {accountData && continentStatus === Status.OwnedByYou && (
                  <div>
                    <Formik
                      initialValues={{
                        address: "",
                      }}
                      onSubmit={(values: Values) => {
                        callTransferContinent(
                          accountData.address,
                          values.address,
                          continentSelected
                        );
                      }}
                      validationSchema={schema}
                    >
                      {(props) => {
                        return (
                          <div className="flex space-x-4 place-content-between">
                            <Button
                              className="float-left bg-red-700 hover:bg-red-600 focus:bg-red-500 text-white"
                              onClick={() => {
                                callRelinquishContinent(continentSelected);
                              }}
                            >
                              Relinquish
                            </Button>
                            <div>
                              <Form className="flex">
                                <div className="relative align-text-top flex place-content-between space-x-2">
                                  {props.errors.address && (
                                    <div className="text-slate-100 absolute bottom-11 left-2 bg-red-700 rounded-sm drop-shadow-lg px-3 font-normal text-sm py-1">
                                      <div className="bg-red-700 rotate-45 absolute w-3 h-3 left-12 top-5 -z-10" />
                                      {props.errors.address &&
                                        props.errors.address}
                                    </div>
                                  )}
                                  <Field
                                    id="address"
                                    name="address"
                                    placeholder="Recipient address"
                                    className="text-slate-900 bg-white border-2 border-slate-300 rounded-sm px-2 outline:none focus:outline-none"
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
                            </div>
                          </div>
                        );
                      }}
                    </Formik>
                  </div>
                )}
                {accountData && continentStatus === Status.OwnedBySomeoneElse && (
                  <div>
                    <Address
                      text={getOwnerAddress(continentSelected)}
                      chainId={networkData?.chain?.id}
                      className="py-1 bg-transparent"
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
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Second slide */}
          {data && (
            <div className="overflow-hidden rounded-lg">
              <CountryDataView data={data} />
            </div>
          )}
        </Slider>
      </Modal>
    </div>
  );
};
