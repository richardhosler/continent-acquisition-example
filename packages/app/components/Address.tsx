import {
  truncateString,
  TruncateStringInterface,
} from "../utils/truncateString";
import { twMerge } from "tailwind-merge";

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
    "rounded-xl py-1 px-2 bg-slate-100 text-sm text-gray-900 text-center hover:bg-slate-200",
    className
  );

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
      {truncateString({ text, prefix, suffix })}
    </span>
  );
};
