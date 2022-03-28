import Davatar from "@davatar/react";
import { Connector } from "wagmi";
import { Button } from "./Button";
import { Address } from "./Address"
interface HeaderInterface {
    address: string | undefined;
    connectors: Connector[];
    networkData: any;
    handleConnect: (connector: Connector) => void;
    handleDisconnect: () => void;
    handleSwitchNetwork: (chainId: number) => void;
}

export const Header = ({ address, connectors, networkData, handleConnect, handleDisconnect, handleSwitchNetwork }: HeaderInterface): JSX.Element => (
    <div className="flex place-content-end place-items-center p-2 space-x-2">
        {/* {networkData.chain?.name ?? networkData.chain?.id}{' '}
        {networkData.chain?.unsupported && '(unsupported)'} */}
        {console.log({ connectors, address })}
        {address === undefined ?
            connectors.map((connector: Connector) => (
                <Button
                    {...!connector.ready && 'disabled'}
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    className='bg-green-600'
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
                <Button onClick={handleDisconnect} className="bg-red-600">Disconnect</Button>
            </>
        }
    </div>
)

