import Davatar from "@davatar/react";
import { Connector } from "wagmi";
import { Button } from "./Button";
import { Address } from "./Address"
import metamaskIcon from "../assets/icons/metamask.svg"
import walletconnectIcon from "../assets/icons/walletconnect.svg"
import { useEffect } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
interface HeaderInterface {
    address: string | undefined;
    connectors: Connector[];
    networkData: any;
    handleConnect: (connector: Connector) => void;
    handleDisconnect: () => void;
    handleSwitchNetwork: (chainId: number) => void;
}

export const Header = ({ address, connectors, networkData, handleConnect, handleDisconnect, handleSwitchNetwork }: HeaderInterface): JSX.Element => {
    const getConnectorIcon = (connector: Connector): string | undefined => {
        switch (connector.name) {
            case "MetaMask":
                return metamaskIcon;
            case "WalletConnect":
                return walletconnectIcon;
        }
    }
    const getConnectorClasses = (connector: Connector): string | undefined => {
        switch (connector.name) {
            case "MetaMask":
                return "text-gray-900 focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700";
            case "WalletConnect":
                return "bg-slate-100 text-gray-900 focus:ring-gray-600 border-gray-700 hover:bg-slate-200";
        }
    }

    return (
        <>
            <div className="flex flex-inline place-content-end place-items-center p-2 space-x-2 bg-Xanadu">
                {/* {networkData.chain?.name ?? networkData.chain?.id}{' '}
        {networkData.chain?.unsupported && '(unsupported)'} */}
                {/* <DarkModeToggle /> */}
                {address === undefined ?
                    connectors.map((connector: Connector) => (

                        <Button
                            {...!connector.ready && 'disabled'}
                            key={connector.id}
                            onClick={() => handleConnect(connector)}
                            className={getConnectorClasses(connector)}
                            icon={getConnectorIcon(connector)}
                        >
                            {connector.name}
                            {!connector.ready && ' (unsupported)'}
                        </Button>
                    )) : <>{handleSwitchNetwork &&
                        networkData.chains.map((x: any) =>
                            x.id === networkData.chain?.id ? null : (
                                <Button key={x.id} onClick={() => handleSwitchNetwork(x.id)}>
                                    Switch to {x.name}
                                </Button>
                            ),
                        )}

                        <Address text={address} prefix={5} suffix={4} />
                        <Davatar size={24} address={address} />
                        <Button onClick={handleDisconnect} className="bg-RedPigment border-red-100 border-1">Disconnect</Button>
                    </>
                }
            </div>
        </>
    )
}

