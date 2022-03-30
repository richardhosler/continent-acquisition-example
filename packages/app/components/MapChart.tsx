import React, { memo, useEffect, useState } from "react";
import mapData from "../assets/world-110m.json"
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import continentToken from "../../contract/build/ContinentToken.json"
import { Result } from "ethers/lib/utils";
import { useContractRead, useProvider, useWaitForTransaction } from "wagmi";
import { getContinentId } from "../utils/getContinentId"
import { object, string } from 'yup';
interface MapChartInterface {
    onTooltipChange: (content: string) => void;
    contractData: Result;
    accountData: any;
    readContractData: any;
    setIsOpen: (isOpen: boolean) => void;
    setContinent: (continent: string) => void;
}

const MapChart = ({ contractData, onTooltipChange, accountData, setIsOpen, setContinent }: MapChartInterface) => {
    const provider = useProvider();
    const [{ data: priceData, error: priceError, loading: priceLoading }, readPrice] = useContractRead({ addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3", contractInterface: continentToken.abi, signerOrProvider: provider }, "getCurrentPrice", { skip: true });
    const [inputAddress, setInputAddress] = useState("");
    const regex = new RegExp(`/^${accountData.address}/`);

    const getOwnerAddress = (ISO: string): string | null => {
        return getContinentId(ISO) != -1 ? contractData[getContinentId(ISO)][1] : null;
    }

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
    return (
        <ComposableMap data-tip="" projectionConfig={{ scale: 180 }} className="bg-blue-500">
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

        </ComposableMap >
    );
};

export default memo(MapChart);
