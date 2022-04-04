import Davatar from "@davatar/react";
import { Connector } from "wagmi";
import { Button } from "./Button";
import { Address } from "./Address";
import metamaskIcon from "../assets/icons/metamask.svg";
import walletconnectIcon from "../assets/icons/walletconnect.svg";
import { twMerge } from "tailwind-merge";
interface HeaderInterface {
  address: string | undefined;
  connectors: Connector[];
  networkData: any;
  className?: string;
  handleConnect: (connector: Connector) => void;
  handleDisconnect: () => void;
  handleSwitchNetwork: (chainId: number) => void;
  handleTooltipChange?: (tooltipContent: string) => void;
}

export const Header = ({
  address,
  connectors,
  networkData,
  className,
  handleConnect,
  handleDisconnect,
  handleSwitchNetwork,
  handleTooltipChange,
}: HeaderInterface): JSX.Element => {
  const getConnectorIcon = (connector: Connector): string | undefined => {
    switch (connector.name) {
      case "MetaMask":
        return metamaskIcon;
      case "WalletConnect":
        return walletconnectIcon;
    }
  };
  const getConnectorClasses = (connector: Connector): string | undefined => {
    switch (connector.name) {
      case "MetaMask":
        return "bg-gray-800 border-slate-600 text-gray-100 hover:bg-gray-700";
      case "WalletConnect":
        return "bg-gray-100 border-slate-600 text-gray-900 hover:bg-slate-200";
    }
  };
  const classes = twMerge(
    "flex flex-inline fixed w-screen place-content-end place-items-center p-2 space-x-2 z-10 bg-teal-800 text-white",
    className
  );
  return (
    <>
      <div className={classes}>
        {/* {networkData.chain?.name ?? networkData.chain?.id}{' '}
        {networkData.chain?.unsupported && '(unsupported)'} */}
        {/* <DarkModeToggle /> */}

        {/* if not connected to a wallet */}
        {address === undefined ? (
          connectors.map((connector: Connector) => (
            <Button
              {...(!connector.ready && "disabled")}
              key={connector.id}
              onClick={() => handleConnect(connector)}
              className={getConnectorClasses(connector)}
              icon={getConnectorIcon(connector)}
            >
              {connector.name}
              {!connector.ready && " (unsupported)"}
            </Button>
          ))
        ) : (
          <>
            {/* if connected to a wallet */}
            {handleSwitchNetwork &&
              networkData.chains.map((x: any) =>
                x.id === networkData.chain?.id ? null : (
                  <Button key={x.id} onClick={() => handleSwitchNetwork(x.id)}>
                    Switch to {x.name}
                  </Button>
                )
              )}

            <Address
              text={address}
              prefix={5}
              suffix={4}
              handleTooltipChange={handleTooltipChange}
            />
            <Davatar size={24} address={address} />
            <Button
              onClick={handleDisconnect}
              className="text-white bg-red-700 hover:bg-red-600 border-red-400 border-2"
            >
              Disconnect
            </Button>
          </>
        )}
      </div>
    </>
  );
};
