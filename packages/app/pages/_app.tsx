import { Provider as WalletProvider, chain, defaultChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = process.env.INFURA_ID

function MyApp({ Component, pageProps }) {
  const supportedChainIds = [4];

  return (
    <WalletProvider autoConnect >
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;