import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface FlagDisplayInterface {
  flags: string[];
  className?: string;
}
export const FlagDisplay = ({
  flags,
  className,
}: FlagDisplayInterface): JSX.Element => {
  const defaultFlagCount = 6;
  const [numFlags, setNumFlags] = useState(defaultFlagCount);
  useEffect(() => {
    setNumFlags(defaultFlagCount);
  }, [setNumFlags]);
  const showMore = () => {
    if (numFlags == defaultFlagCount) {
      setNumFlags(flags.length);
    } else {
      setNumFlags(defaultFlagCount);
    }
  };
  const classNames = twMerge("w-80 cursor-pointer text-2xl", className);
  return (
    <div className={classNames} onClick={showMore}>
      {flags.slice(0, numFlags).flatMap((flag) => [flag, " "])}
      <span onClick={showMore}>&nbsp;ᐯ</span>
    </div>
  );
};
