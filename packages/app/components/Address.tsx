import {
  truncateString,
  TruncateStringInterface,
} from "../utils/truncateString";
import { twMerge } from "tailwind-merge";
import Davatar from "@davatar/react";
import { useMemo } from "react";

interface AddressInterface extends TruncateStringInterface {
  className?: string;
  chainId?: number;
}

export const Address = ({
  text,
  prefix,
  suffix,
  className,
  chainId,
}: AddressInterface): JSX.Element => {
  const getEtherscanUrl = useMemo(() => {
    switch (chainId) {
      case 4:
        return `https://rinkeby.etherscan.io/address/${text}`;
      case 42:
        return `https://kovan.etherscan.io/address/${text}`;
    }

    return `https://etherscan.io/address/${text}`;
  }, [chainId, text]);

  const classes = twMerge(
    "inline-flex rounded-sm text-slate-900 w-min text-sm space-x-3 place-items-center cursor-pointer",
    className
  );

  return !text || text.match(/0{40}/) ? (
    <span className={classes}>NONE</span>
  ) : (
    <a
      className={classes}
      data-tip={text}
      data-place="bottom"
      data-for="floater"
      data-effect="float"
      href={getEtherscanUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Davatar size={24} address={text} />
      <span className="align-text-top">
        {truncateString({ text, prefix, suffix })}
      </span>
    </a>
  );
};
