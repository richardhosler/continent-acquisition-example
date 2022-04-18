import {
  truncateString,
  TruncateStringInterface,
} from "../utils/truncateString";
import { twMerge } from "tailwind-merge";
import Davatar from "@davatar/react";
import Link from "next/link";

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
  const classes = twMerge(
    "inline-flex rounded-sm text-slate-900 bg-slate-200 hover:bg-slate-100 w-min text-sm space-x-3 place-items-center cursor-pointer",
    className
  );

  return !text || text.match(/0{40}/) ? (
    <span className={classes}>NONE</span>
  ) : (
    <a
      className={classes}
      data-tip={text}
      data-place="bottom"
      data-effect="float"
      href={
        chainId === 4
          ? `https://rinkeby.etherscan.io/address/${text}`
          : `https://etherscan.io/address/${text}`
      }
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
