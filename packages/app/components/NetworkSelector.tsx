import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { WagmiNetworkDataInterface } from "../interfaces/WagmiNetworkDataInterface";
import chevron from "../assets/icons/chevron.svg";
import Image from "next/image";
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
  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
  return (
    <div className="inline-flex relative font-normal text-sm">
      <button
        className={
          isMenuVisible
            ? "inline-flex space-x-4 place-content-between bg-slate-700 text-slate-100 rounded-t-sm px-3 py-2 w-[100px] hover:bg-slate-600"
            : "inline-flex space-x-4 place-content-between bg-slate-700 text-slate-100 rounded-sm px-3 py-2 w-[100px]"
        }
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        onClick={toggleMenu}
        onBlur={toggleMenu}
      >
        <span>{networkData.chain?.name}</span>
        {<Image src={chevron} alt="chevron" width={10} height={10}></Image>}
      </button>

      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
        className={twMerge(
          "absolute bg-slate-100 right-0 top-9 w-[100px] text-center text-slate-800 rounded-b-sm  py-2 drop-shadow-xl",
          `${isMenuVisible ? "block" : "hidden"}`
        )}
      >
        <div role="none" className="">
          {networkData.chains.map((chain, key) =>
            chain.id === networkData.chain?.id ? null : (
              <a
                key={key}
                href="#"
                className="block hover:bg-slate-300 py-2"
                onClick={() => onSwitchNetwork(chain.id)}
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
