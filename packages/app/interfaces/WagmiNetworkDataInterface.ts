import { Chain } from "wagmi";

export interface WagmiNetworkDataInterface {
  chain:
    | {
        id: number;
        unsupported: boolean | undefined;
        name?: string | undefined;
        nativeCurrency?:
          | {
              name: string;
              symbol: string;
              decimals: 18;
            }
          | undefined;
        rpcUrls?: string[] | undefined;
        blockExplorers?:
          | {
              name: string;
              url: string;
            }[]
          | undefined;
        testnet?: boolean | undefined;
      }
    | undefined;
  chains: Chain[];
}
