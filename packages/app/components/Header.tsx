import Davatar from "@davatar/react";
import { Connector } from "wagmi";
import { Button } from "./Button";
import { Address } from "./Address";
import metamaskIcon from "../assets/icons/metamask.svg";
import walletconnectIcon from "../assets/icons/walletconnect.svg";
import { twMerge } from "tailwind-merge";
import { CurrencyInterface } from "../utils/gweiFormatter";
interface HeaderInterface {
  address: string | undefined;
  connectors: Connector[];
  networkData: any;
  currentPrice?: CurrencyInterface;
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
  currentPrice,
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

  const classes = twMerge(
    "flex flex-inline fixed w-full place-content-end place-items-center p-2 space-x-2 bg-slate-800 text-slate-100",
    className
  );

  return (
    <>
      <div className={classes}>
        {/* {networkData.chain?.name ?? networkData.chain?.id}{' '}
        {networkData.chain?.unsupported && '(unsupported)'} */}
        {/* <DarkModeToggle /> */}
        <div className="space-x-2 place-self-center">
          <span>{currentPrice?.amount}</span>
          <span>{currentPrice?.symbol}</span>
        </div>
        {/* if not connected to a wallet */}
        {address === undefined ? (
          connectors.map((connector: Connector) => (
            <Button
              {...(!connector.ready && "disabled")}
              key={connector.id}
              onClick={() => handleConnect(connector)}
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
              className="bg-slate-800 text-slate-100 hover:bg-slate-700"
            />
            <Button onClick={handleDisconnect}>Disconnect</Button>
          </>
        )}
      </div>
    </>
  );
};
