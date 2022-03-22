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
import { useContractRead, useContractWrite, useProvider } from "wagmi";

import { getContinentId } from "../utils/getContinentId"

interface MapChartInterface {
    onTooltipChange: (content: string) => void,
    contractData: Result,
    accountData: any
}

const MapChart = ({ contractData, onTooltipChange, accountData }: MapChartInterface) => {
    const provider = useProvider();
    const [{ data: contractWriteData, error: contractWriteError, loading: contractWriteLoading }, write] = useContractWrite({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "acquireContinent")
    const [{ data: priceData, error: priceError, loading: priceLoading }, readPrice] = useContractRead({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "getCurrentPrice", { skip: false });
    const [modalIsOpen, setIsOpen] = useState(false);
    const [continentSelected, setContinent] = useState("");

    const getOwnerAddress = (continent: string): string | null => {
        const ownerAddress = contractData.find(([countryName]) => countryName === continent);
        return ownerAddress ? ownerAddress[1] : null;
    }

    const callAcquireContinent = (continentNameOrId: number | string, price: Result | undefined) => {
        const continentId = typeof (continentNameOrId) == 'string' ? getContinentId(continentNameOrId) : continentNameOrId;
        write({ args: continentId, overrides: { from: accountData.address, value: price } })
    }

    function openModal() {
        setIsOpen(true);
    };
    function closeModal() {
        setIsOpen(false);
    };

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
                                    fill: getOwnerAddress(geo.properties.continent) == "0x0000000000000000000000000000000000000000" ? "#A2EEA2" : "#EEA2A2", outline: "none"
                                },
                                hover: {
                                    fill: getOwnerAddress(geo.properties.continent) == "0x0000000000000000000000000000000000000000" ? "#D2FED2" : "#FED2D2",
                                    outline: "#0F0F0F"
                                },
                                pressed: {
                                    fill: "#E42",
                                    outline: "none"
                                }
                            }}
                            onMouseEnter={() => {
                                const { continent } = geo.properties;
                                onTooltipChange(`some content on ${continent}`);
                            }}
                            onMouseLeave={() => {
                                onTooltipChange("");
                            }}
                            onMouseDown={() => {
                                setContinent(geo.properties.continent);
                                openModal();
                            }}

                        />

                    ))
                }
            </Geographies>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
            >
                <button onClick={closeModal}>close</button>
                <h2>{continentSelected}</h2>
                <p>Owner: {getOwnerAddress(continentSelected)}</p>
                <p>Price: {priceData?.toString()} gwei</p>
                <button onClick={async () => callAcquireContinent(continentSelected, await priceData)}>Purchase</button>
            </Modal>
        </ComposableMap>
    );
};

export default memo(MapChart);
