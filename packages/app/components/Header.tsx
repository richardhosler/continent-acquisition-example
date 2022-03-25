import Davatar from "@davatar/react";
import { Result } from "@ethersproject/abi";
import { memo } from "react";
import { Connector } from "wagmi";
import Button from "../components/Button";

interface PageHeaderInterface {
    address: string | undefined;
    connectors: Connector[];
    networkData: any;
    handleConnect: (connector: Connector) => void;
    handleDisconnect: () => void;
    handleSwitchNetwork: (chainId: number) => void;
}
const Header = ({ address, connectors, networkData, handleConnect, handleDisconnect, handleSwitchNetwork }: PageHeaderInterface) => {
    return (
        <div>
            {!address ?
                connectors.map((connector: Connector) => {
                    <Button
                        {...!connector.ready && 'disabled'}
                        key={connector.id}
                        onClick={() => handleConnect(connector)}
                        className='bg-green-600'
                    >
                        {connector.name}
                        {!connector.ready && ' (unsupported)'}
                    </Button>
                }) : <div className="flex place-content-end">
                    {handleSwitchNetwork &&
                        networkData.chains.map((x: any) =>
                            x.id === networkData.chain?.id ? null : (
                                <Button key={x.id} onClick={() => handleSwitchNetwork(x.id)}>
                                    Switch to {x.name}
                                </Button>
                            ),
                        )}
                    <Davatar size={24} address={address} />
                    <Button onClick={handleDisconnect} className="bg-red-600">Disconnect</Button>
                </div>
            }
        </div>
    )
}
export default memo(Header);
