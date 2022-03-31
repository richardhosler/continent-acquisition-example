import React, { memo } from "react";
import mapData from "../assets/world-110m.json";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Result } from "ethers/lib/utils";
import { getContinentId } from "../utils/getContinentId";
interface MapChartInterface {
  onTooltipChange: (content: string) => void;
  contractData: Result;
  accountData: any;
  readContractData: any;
  setIsOpen: (isOpen: boolean) => void;
  setContinent: (continent: string) => void;
}

const MapChart = ({
  contractData,
  onTooltipChange,
  accountData,
  setIsOpen,
  setContinent,
}: MapChartInterface) => {
  const getOwnerAddress = (ISO: string): string | null => {
    return getContinentId(ISO) != -1
      ? contractData[getContinentId(ISO)][1]
      : null;
  };

  const getContinentColour = (ISO: string, hover: boolean) => {
    if (hover) {
      switch (getOwnerAddress(ISO)) {
        case accountData.address:
          return "#EFEFFF";
        case "0x0000000000000000000000000000000000000000":
          return "#EFFFEF";
        default:
          return "#EEEFEF";
      }
    } else {
      switch (getOwnerAddress(ISO)) {
        case accountData.address:
          return "#EEEEAF";
        case "0x0000000000000000000000000000000000000000":
          return "#AFEEAF";
        default:
          return "#EEAFAF";
      }
    }
  };
  return (
    <ComposableMap
      data-tip=""
      projectionConfig={{ scale: 120 }}
      className="bg-blue-500 relative -top-1/4"
    >
      <Geographies geography={mapData}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: {
                  fill: getContinentColour(geo.properties.ISO, false),
                  outline: "none",
                },
                hover: {
                  fill: getContinentColour(geo.properties.ISO, true),
                  outline: "#0F0F0F",
                },
                pressed: {
                  fill: "#E42",
                  outline: "none",
                },
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
    </ComposableMap>
  );
};

export default memo(MapChart);
