import React, { memo } from "react";
import mapData from "../assets/world-110m.json";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Result } from "ethers/lib/utils";
import { getContinentId } from "../utils/getContinentData";
import colors from "tailwindcss/colors";
import { Connector } from "wagmi";
interface MapChartInterface {
  onTooltipChange: (content: string) => void;
  contractData?: Result;
  accountData?:
    | {
        address: string;
        connector: Connector<any, any> | undefined;
        ens: { avatar: string | null | undefined; name: string } | undefined;
      }
    | undefined;
  setIsOpen: (isOpen: boolean) => void;
  setContinent: (continent: string) => void;
}
const Map = ({
  contractData,
  onTooltipChange,
  accountData,
  setIsOpen,
  setContinent,
}: MapChartInterface) => {
  const getOwnerAddress = (iso: string): string | null => {
    return contractData && getContinentId(iso) != -1
      ? contractData[getContinentId(iso)][1]
      : null;
  };
  type Colour = {
    default: string;
    hover: string;
  };
  const getContinentColour = (iso: string): Colour => {
    if (!accountData) return { default: "#CCC", hover: "#CCC" };
    let colour = {} as Colour;
    switch (getOwnerAddress(iso)) {
      case accountData.address:
        colour.default = colors.yellow[600];
        colour.hover = colors.yellow[500];
        break;
      case "0x0000000000000000000000000000000000000000":
        colour.default = colors.green["600"];
        colour.hover = colors.green["500"];
        break;
      default:
        if (
          getOwnerAddress(iso)?.match(/^0x[a-fA-f1-9]*/) !== null &&
          getOwnerAddress(iso) !== accountData.address &&
          getOwnerAddress(iso) !== "0x0000000000000000000000000000000000000000"
        ) {
          colour.default = colors.red["600"];
          colour.hover = colors.red["500"];
          break;
        }
        colour.default = colors.green["600"];
        colour.hover = colors.green["500"];
    }
    return colour;
  };
  return (
    <ComposableMap
      data-tip=""
      projectionConfig={{ scale: 170 }}
      className="pt-6 max-h-screen w-full"
    >
      <Geographies geography={mapData}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: {
                  fill: getContinentColour(geo.properties.ISO).default,
                  outline: "none",
                },
                hover: {
                  fill: getContinentColour(geo.properties.ISO).hover,
                  outline: "none",
                },
                pressed: {
                  fill: "#CCC",
                  outline: "none",
                },
              }}
              onMouseEnter={() => {
                onTooltipChange(geo.properties.continent);
              }}
              onMouseLeave={() => {
                onTooltipChange("");
              }}
              onMouseDown={
                accountData
                  ? () => {
                      setContinent(geo.properties.ISO);
                      setIsOpen(true);
                    }
                  : undefined
              }
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default memo(Map);
