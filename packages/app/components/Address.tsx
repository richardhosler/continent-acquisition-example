import {
  truncateString,
  TruncateStringInterface,
} from "../utils/truncateString";
import { twMerge } from "tailwind-merge";
import Davatar from "@davatar/react";

interface AddressInterface extends TruncateStringInterface {
  className?: string;
  handleTooltipChange?: (tooltipContent: string) => void;
}

export const Address = ({
  text,
  prefix,
  suffix,
  className,
  handleTooltipChange,
}: AddressInterface): JSX.Element => {
  const classes = twMerge(
    "flex inline-flex rounded-sm text-slate-900 bg-slate-200 hover:bg-slate-100 w-min px-3 py-1.5 text-sm space-x-3 place-items-center cursor-pointer",
    className
  );
  const style = {
    // paddingBottom: "2rem",
  };
  return text.match(/0{40}/) ? (
    <span className={classes}>NONE</span>
  ) : (
    <span
      className={classes}
      onMouseEnter={() => {
        handleTooltipChange && handleTooltipChange(text);
      }}
      onMouseLeave={() => {
        handleTooltipChange && handleTooltipChange("");
      }}
      onClick={() => {
        window.open(`https://etherscan.io/address/${text}`);
      }}
    >
      <Davatar size={24} address={text} style={style} />
      <span className="align-text-top">
        {truncateString({ text, prefix, suffix })}
      </span>
    </span>
  );
};
