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
  const defaultFlagCount = 10;
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
  const classNames = twMerge("w-60 cursor-pointer", className);
  return (
    <div className={classNames} onClick={showMore}>
      {flags.slice(0, numFlags).flatMap((flag) => [flag, " "])}
      <span onClick={showMore}>&gt;</span>
    </div>
  );
};
