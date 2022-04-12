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
    "flex inline-flex rounded-sm text-slate-900 bg-slate-200 hover:bg-slate-100 w-min p-3 text-sm space-x-2 pb-2",
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
    >
      {truncateString({ text, prefix, suffix })}&nbsp;&nbsp;
      <Davatar size={24} address={text} style={style} />
    </span>
  );
};
