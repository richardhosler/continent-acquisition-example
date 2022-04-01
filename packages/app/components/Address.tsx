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
    "rounded-md border-2 py-1 px-2 bg-slate-100 border-slate-600 text-xs text-gray-900 text-center font-semibold",
    className
  );
  if (text.match(/0{40}/)) {
    return <span className={classNames}>NONE</span>;
  } else {
    return (
      <span
        className={classNames}
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
  }
};
