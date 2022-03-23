import React, { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import Modal from "react-modal";
import mapData from "../assets/world-110m.json"
import {
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";
import continentToken from "../../contract/build/ContinentToken.json"

import { Result } from "ethers/lib/utils";
import { useContractRead, useContractWrite, useProvider, useWaitForTransaction } from "wagmi";

import { getContinentId } from "../utils/getContinentId"
import { format } from "path";

interface MapChartInterface {
    onTooltipChange: (content: string) => void,
    contractData: Result,
    accountData: any,
    readContractData: any,
    onContractChange: () => void
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
    const getOwnerAddress = (ISO: string): string | null => {
        return getContinentId(ISO) != -1 ? contractData[getContinentId(ISO)][1] : null;
    }
    function stringToByteArray(s: string) {
        var result = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) {
            result[i] = s.charCodeAt(i);
        }
        return result;
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
    }, [wait, onContractChange])

    Modal.setAppElement('#__next');
    return (
        <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
            <Geographies geography={mapData}>
                {({ geographies }) =>
                    geographies.map(geo => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            style={{
                                default: {
                                    fill: getOwnerAddress(geo.properties.ISO) == "0x0000000000000000000000000000000000000000" ? "#A2EEA2" : "#EEA2A2", outline: "none"
                                },
                                hover: {
                                    fill: getOwnerAddress(geo.properties.ISO) == "0x0000000000000000000000000000000000000000" ? "#D2FED2" : "#FED2D2",
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
                <button onClick={() => setIsOpen(false)}>close</button>
                <h2>{continentSelected}</h2>
                <p>Owner: {getOwnerAddress(continentSelected)}</p>
                <p>Price: {priceData?.toString()} gwei</p>
                {getOwnerAddress(continentSelected) != accountData.address ?
                    <button onClick={async () => callAcquireContinent(continentSelected, await priceData)}>Purchase</button> :
                    <><button onClick={() => callRelinquishContinent(continentSelected)}>Relinquish</button>
                        <div><input value={inputAddress} onChange={({ target }) => setInputAddress(target.value)} /><button onClick={() => callTransferContinent(accountData.address, inputAddress, continentSelected)}>Transfer</button></div></>}
            </Modal>
        </ComposableMap >
    );
};

export default memo(MapChart);
