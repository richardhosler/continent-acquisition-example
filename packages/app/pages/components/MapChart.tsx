import React, { memo } from "react";
import mapData from "../../assets/world-110m.json"
import {
    ZoomableGroup,
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";

const MapChart = ({ setTooltipContent }: { setTooltipContent: any }) => {
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
                                    fill: "#D6D6DA",
                                    outline: "none"
                                },
                                hover: {
                                    fill: "#F53",
                                    outline: "none"
                                },
                                pressed: {
                                    fill: "#E42",
                                    outline: "none"
                                }
                            }}
                            onMouseEnter={() => {
                                const { continent } = geo.properties;
                                setTooltipContent(`some content on ${continent}`);
                            }}
                            onMouseLeave={() => {
                                setTooltipContent("");
                            }}
                        />
                    ))
                }
            </Geographies>
        </ComposableMap>
    );
};

export default memo(MapChart);
