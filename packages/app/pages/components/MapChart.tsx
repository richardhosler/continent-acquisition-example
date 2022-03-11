import React, { memo } from "react";
import {
    ZoomableGroup,
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";

const geoUrl = "../assets/world-110m.json";
const MapChart = () => {

    return (
        <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
            <Geographies geography={geoUrl}>
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
                            onClick={() => {
                                const iso = geo.properties.ISO_A3;
                                console.log(iso)
                            }}
                        />
                    ))
                }
            </Geographies>
        </ComposableMap>
    );
};

export default memo(MapChart);
