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
  handleTooltipChange?: (tooltipContent: string) => void;
}

export const Address = ({
  text,
  prefix,
  suffix,
  className,
  chainId,
  handleTooltipChange,
}: AddressInterface): JSX.Element => {
  const classes = twMerge(
    "flex inline-flex rounded-sm text-slate-900 bg-slate-200 hover:bg-slate-100 w-min px-3 py-1.5 text-sm space-x-3 place-items-center cursor-pointer",
    className
  );

  return text.match(/0{40}/) ? (
    <span className={classes}>NONE</span>
  ) : (
    <a
      className={classes}
      onMouseEnter={() => {
        handleTooltipChange && handleTooltipChange(text);
      }}
      onMouseLeave={() => {
        handleTooltipChange && handleTooltipChange("");
      }}
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
