export const gweiFormatter = (gwei: string | undefined): string => {
  if (gwei === undefined) {
    return "0";
  } else if (gwei.length > 5) {
    let gwe = BigInt(gwei);
    let dec = 1000000000000000000n;
    let eth = Number(gwe / dec);
    return `${eth} ETH`;
  } else return `${gwei} Gwei`;
};
