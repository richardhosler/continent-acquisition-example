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
  const classNames = twMerge(
    "rounded-md border-2 px-2 bg-slate-100 border-slate-600 text-sm text-gray-900 w-24",
    className
  );
  return (
    <div
      className={classNames}
      onMouseEnter={() => {
        handleTooltipChange && handleTooltipChange(text);
      }}
      onMouseLeave={() => {
        handleTooltipChange && handleTooltipChange("");
      }}
    >
      {truncateString({ text, prefix, suffix })}
    </div>
  );
};
