import { useEffect, useState } from "react";

interface FlagDisplayInterface {
  flags: string[];
}
export const FlagDisplay = ({ flags }: FlagDisplayInterface): JSX.Element => {
  const defaultFlagCount = 5;
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
  if (numFlags == defaultFlagCount) {
    return (
      <div onClick={showMore}>
        {flags.slice(0, numFlags)}
        <span onClick={showMore}>&gt;</span>
      </div>
    );
  } else {
    return (
      <div className="w-40" onClick={showMore}>
        {flags.flatMap((flag, index) => (index % 10 == 0 && index != 0 ? [`\n`, flag] : [flag]))}
        <span onClick={showMore}>&gt;</span>
      </div>
    );
  }
};
