import { providers } from "ethers";
import { useEffect } from "react";
import { Toaster, ToastPosition } from "react-hot-toast";
import {
  Provider as WalletProvider,
  chain,
  defaultChains,
  Connector,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "react-query";

import "../styles/globals.css";

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = process.env.INFURA_ID;
const chains = defaultChains;
const queryClient = new QueryClient();
const connectors = () => {
  return [
    new InjectedConnector({
      chains: [
        {
          id: 31337,
          name: "hardhat",
          testnet: true,
          rpcUrls: ["http://localhost:8545"],
        },
      ],
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
  ];
};

type GetProviderArgs = {
  chainId?: number;
  connector?: Connector;
};

const provider = ({ chainId, connector }: GetProviderArgs) => {
  if (chainId == 31337) {
    const chain = connector?.chains.find((x) => x.id == 31337)?.rpcUrls[0];
    return new providers.JsonRpcProvider(chain);
  }
  return providers.getDefaultProvider(chainId);
};

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <WalletProvider autoConnect connectors={connectors} provider={provider}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Toaster position="bottom-right" reverseOrder={true} />
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </WalletProvider>
  );
}

export default MyApp;
