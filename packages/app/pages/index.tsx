import React from "react";
import type { NextPage } from 'next'
import "regenerator-runtime/runtime";
import MapChart from "./components/MapChart";
import { useConnect } from "wagmi";

const Home: NextPage = () => {
  const [{ data, error }, connect] = useConnect()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-100">
      <div>
        {data.connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect(connector)}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
          </button>
        ))}

        {error && <div>{error?.message ?? 'Failed to connect'}</div>}
      </div>
      <div className="flex">
        <MapChart />
      </div>
    </div>
  );
}

export default Home
