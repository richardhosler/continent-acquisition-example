import { providers } from "ethers";
import { Toaster } from "react-hot-toast";
import { Provider as WalletProvider, defaultChains, Connector } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { env } from "process";

const queryClient = new QueryClient();
const connectors = () => {
  const chains = [
    {
      id: 4,
      name: "rinkeby",
      testnet: true,
      rpcUrls: [
        process.env.NEXT_PUBLIC_RINKEBY_URL
          ? process.env.NEXT_PUBLIC_RINKEBY_URL
          : "",
      ],
    },
    {
      id: 42,
      name: "kovan",
      testnet: true,
      rpcUrls: [
        process.env.NEXT_PUBLIC_KOVAN_URL
          ? process.env.NEXT_PUBLIC_KOVAN_URL
          : "",
      ],
    },
  ];

  if (process.env.NODE_ENV === "development") {
    chains.push({
      id: 31337,
      name: "hardhat",
      testnet: true,
      rpcUrls: ["http://localhost:8545"],
    });
  }
  console.log(process.env.NODE_ENV);

  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        chainId: 4,
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
  return providers.getDefaultProvider(chainId, {
    alchemy: "i-KZTigEwKaHOshLhZ6btF0XpRI0dFHq",
  });
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
