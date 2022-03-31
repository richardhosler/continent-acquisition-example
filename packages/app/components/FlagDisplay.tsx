interface FlagDisplayInterface {
  flags: string[];
}

export const FlagDisplay = ({ flags }: FlagDisplayInterface): JSX.Element => {
  let count = 5;
  const showMore = () => {
    if (count == 5) {
      count = flags.length;
    } else {
      count = 5;
    }
  };
  return <>{flags.slice(0, count)}</>;
};
