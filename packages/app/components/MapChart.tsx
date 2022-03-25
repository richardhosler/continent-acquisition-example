import React, { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import Modal from "react-modal";
import mapData from "../assets/world-110m.json"
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import continentToken from "../../contract/build/ContinentToken.json"
import { Result } from "ethers/lib/utils";
import { useContractRead, useContractWrite, useProvider, useWaitForTransaction } from "wagmi";
import { getContinentId } from "../utils/getContinentId"
import { Formik, Field, Form, FormikHelpers } from "formik";
import { z } from "zod";
import { object, string, number, date, InferType } from 'yup';
import isEthereumAddress from "validator";
import Button from "./Button";
const stringToByteArray = (s: string) => {
    var result = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) {
        result[i] = s.charCodeAt(i);
    }
    return result;
}
interface MapChartInterface {
    onTooltipChange: (content: string) => void;
    contractData: Result;
    accountData: any;
    readContractData: any;
    onContractChange: () => void;
}
interface Values {
    address: string;
}

const MapChart = ({ contractData, onTooltipChange, accountData, readContractData, onContractChange }: MapChartInterface) => {
    const provider = useProvider();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [{ data: acquireContinentData, error: acquireContinentError, loading: acquireContinentLoading }, acquireContractCall] = useContractWrite({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "acquireContinent")
    const [{ data: relinquishContinentData, error: relinquishContinentError, loading: relinquishContinentLoading }, relinquishContinentCall] = useContractWrite({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "relinquishContinent")
    const [{ data: transferContinentData, error: transferContinentError, loading: transferContinentLoading }, transferContinentCall] = useContractWrite({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "transferContinent")
    const [{ data: priceData, error: priceError, loading: priceLoading }, readPrice] = useContractRead({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "getCurrentPrice", { skip: false });
    const [continentSelected, setContinent] = useState("");
    const [{ data: transactionData, error: transactionError, loading: transactionLoading }, wait] = useWaitForTransaction({ skip: true });
    const [inputAddress, setInputAddress] = useState("");
    const regex = new RegExp(`/^${accountData.address}/`);
    const schema = object({
        address: string().trim().matches(/^0x[0-9a-f]{40}$/i, "Invalid Etherium address.").test("isYours", "You already own this.", value => value !== accountData.address).required(),
    });
    const getOwnerAddress = (ISO: string): string | null => {
        return getContinentId(ISO) != -1 ? contractData[getContinentId(ISO)][1] : null;
    }
    const callAcquireContinent = (ISO: string, price: Result | undefined) => {
        acquireContractCall({ args: stringToByteArray(ISO), overrides: { from: accountData.address, value: price } });
        wait({ wait: acquireContinentData?.wait });
    }
    const callRelinquishContinent = (ISO: string) => {
        relinquishContinentCall({ args: stringToByteArray(ISO) })
    }
    const callTransferContinent = (from: string, to: string, ISO: string) => {
        transferContinentCall({ args: [from, to, stringToByteArray(ISO)] })
    }
    useEffect(() => {
        onContractChange;
    }, [transactionData, onContractChange])
    const getContinentColour = (ISO: string, hover: boolean) => {
        if (hover) {
            switch (getOwnerAddress(ISO)) {
                case accountData.address:
                    return "#EFEFFF"
                case "0x0000000000000000000000000000000000000000":
                    return "#EFFFEF"
                default:
                    return "#EEEFEF"
            }
        } else {
            switch (getOwnerAddress(ISO)) {
                case accountData.address:
                    return "#EEEEAF"
                case "0x0000000000000000000000000000000000000000":
                    return "#AFEEAF"
                default:
                    return "#EEAFAF"
            }
        }
    }
    Modal.setAppElement('#__next');
    return (
        <ComposableMap data-tip="" projectionConfig={{ scale: 180 }}>
            <Geographies geography={mapData}>
                {({ geographies }) =>
                    geographies.map(geo => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            style={{
                                default: {
                                    fill: getContinentColour(geo.properties.ISO, false),
                                    outline: "none"
                                },
                                hover: {
                                    fill: getContinentColour(geo.properties.ISO, true),
                                    outline: "#0F0F0F"
                                },
                                pressed: {
                                    fill: "#E42",
                                    outline: "none"
                                }
                            }}
                            onMouseEnter={() => {
                                onTooltipChange(`some content on ${geo.properties.continent}`);
                            }}
                            onMouseLeave={() => {
                                onTooltipChange("");
                            }}
                            onMouseDown={() => {
                                setContinent(geo.properties.ISO);
                                setIsOpen(true);
                            }}

                        />

                    ))
                }
            </Geographies>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                contentLabel="Modal"
            >
                <Button onClick={() => setIsOpen(false)}>close</Button>
                <h2>{continentSelected}</h2>
                <p>Owner: {getOwnerAddress(continentSelected)}</p>
                <p>Price: {priceData?.toString()} gwei</p>
                {getOwnerAddress(continentSelected) != accountData.address ?
                    <Button onClick={async () => callAcquireContinent(continentSelected, await priceData)}>Purchase</Button> :
                    <>
                        <Button onClick={() => callRelinquishContinent(continentSelected)}>Relinquish</Button>
                        <Formik
                            initialValues={{
                                address: "",
                            }}
                            onSubmit={(
                                values: Values,
                                { setSubmitting }: FormikHelpers<Values>
                            ) => {
                                setTimeout(() => {
                                    callTransferContinent(accountData.address, values.address, continentSelected);
                                    setSubmitting(false);
                                }, 500);
                            }}
                            validationSchema={schema}
                        >
                            {props => {
                                console.log(props);

                                return (
                                    <Form>
                                        <Field id="address" name="address" placeholder="" />
                                        {props.errors.address && props.errors.address}
                                        <Button type="submit" disabled={!(props.isValid && props.dirty)}>Transfer</Button>
                                    </Form>)
                            }}
                        </Formik>
                    </>}
            </Modal>
        </ComposableMap >
    );
};

export default memo(MapChart);
