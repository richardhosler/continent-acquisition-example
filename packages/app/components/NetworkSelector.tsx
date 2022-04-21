import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { WagmiNetworkDataInterface } from "../interfaces/WagmiNetworkDataInterface";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface NetworkSelectorInterface {
  onSwitchNetwork: (chainId: number) => void;
  networkData: WagmiNetworkDataInterface;
}

export const NetworkSelector = ({
  onSwitchNetwork,
  networkData,
}: NetworkSelectorInterface) => {
  console.log(networkData.chains);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const classNames =
    "flex flex-row space-x-2 place-items-center bg-slate-700 text-slate-100 px-3 py-2 w-[100px] hover:bg-slate-600";
  return (
    <div className="inline-flex relative font-normal text-sm capitalize">
      <button
        className={
          isMenuVisible
            ? twMerge("rounded-t-sm", classNames)
            : twMerge("rounded-sm", classNames)
        }
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        onClick={() => setIsMenuVisible(!isMenuVisible)}
      >
        <span>Network</span>
        <FontAwesomeIcon icon={isMenuVisible ? faChevronUp : faChevronDown} />
      </button>

      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
        className={twMerge(
          "absolute bg-slate-100 right-0 top-9 w-[100px] text-center text-slate-800 rounded-b-sm pb-2 drop-shadow-xl",
          `${isMenuVisible ? "block" : "hidden"}`
        )}
      >
        <div role="none" className="">
          {networkData.chains.map((chain, key) =>
            chain.id === networkData.chain?.id ? (
              <a
                key={key}
                href="#"
                className="block bg-slate-700 text-slate-100 py-2 border-t border-slate-500"
              >
                {chain.name}
              </a>
            ) : (
              <a
                key={key}
                href="#"
                className="block hover:bg-slate-300 py-2"
                onClick={() => {
                  onSwitchNetwork(chain.id);
                  setIsMenuVisible(false);
                }}
              >
                {chain.name}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};
