import { Connector } from "wagmi";
import { Button } from "./Button";
import { Address } from "./Address";
import metamaskIcon from "../assets/icons/metamask.svg";
import walletconnectIcon from "../assets/icons/walletconnect.svg";
import { twMerge } from "tailwind-merge";
import { CurrencyInterface } from "../utils/gweiFormatter";
import headerLogo from "../assets/icons/globe.svg";
import infoIcon from "../assets/icons/info.svg";
import Image from "next/image";
import { NetworkSelector } from "./NetworkSelector";
import { WagmiNetworkDataInterface } from "../interfaces/WagmiNetworkDataInterface";
interface HeaderInterface {
  address: string | undefined;
  connectors: Connector[];
  networkData: WagmiNetworkDataInterface;
  currentPrice?: CurrencyInterface;
  className?: string;
  onConnect: (connector: Connector) => void;
  onDisconnect: () => void;
  onSwitchNetwork: (chainId: number) => void;
}

export const Header = ({
  address,
  connectors,
  networkData,
  currentPrice,
  className,
  onConnect,
  onDisconnect,
  onSwitchNetwork,
}: HeaderInterface): JSX.Element => {
  const getConnectorIcon = (connector: Connector): string | undefined => {
    switch (connector.name) {
      case "MetaMask":
        return metamaskIcon;
      case "WalletConnect":
        return walletconnectIcon;
    }
  };

  const classes = twMerge(
    "grid grid-cols-3 fixed w-full p-2 space-x-2 bg-slate-800 text-slate-100",
    className
  );

  return (
    <>
      <div className={classes}>
        <div className="space-x-3 relative top-0.5">
          <Image src={headerLogo} alt="Header Logo" width={30} height={30} />
          <span className="align-top font-semibold text-lg">
            Continent Aquisition Demo
          </span>
        </div>
        <div
          className="space-x-1 place-self-center"
          data-place="bottom"
          data-effect="float"
          data-for="floater"
          data-tip="Current price of each continent, will increase with each continent purchased"
        >
          <span>{currentPrice?.amount}</span>
          <span>{currentPrice?.symbol}</span>
          {currentPrice?.amount && (
            <span className="relative top-1">
              <Image src={infoIcon} alt="Info Icon" width={20} height={20} />
            </span>
          )}
        </div>
        {/* {networkData.chain?.name ?? networkData.chain?.id}{' '}
        {networkData.chain?.unsupported && '(unsupported)'} */}
        {/* <DarkModeToggle /> */}
        {/* if not connected to a wallet */}
        <span className="place-self-end space-x-2">
          {address === undefined ? (
            connectors.map((connector: Connector) => (
              <Button
                {...(!connector.ready && "disabled")}
                key={connector.id}
                onClick={() => onConnect(connector)}
                icon={getConnectorIcon(connector)}
              >
                {connector.name}
                {!connector.ready && " (unsupported)"}
              </Button>
            ))
          ) : (
            <span className="space-x-2">
              {/* if connected to a wallet */}

              <Address
                text={address}
                prefix={5}
                suffix={4}
                className="bg-slate-800 text-slate-100 hover:bg-slate-700 relative top-1.5 "
                chainId={networkData.chain?.id}
              />
              {onSwitchNetwork && (
                <NetworkSelector
                  onSwitchNetwork={onSwitchNetwork}
                  networkData={networkData}
                />
              )}
              <Button onClick={onDisconnect}>Disconnect</Button>
            </span>
          )}
        </span>
      </div>
    </>
  );
};
