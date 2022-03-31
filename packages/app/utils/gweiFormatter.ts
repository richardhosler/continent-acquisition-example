export const gweiFormatter = (gwei: string | undefined): string => {
  if (gwei === undefined) {
    return "0";
  } else if (gwei.length > 5) {
    let eth = "0.";
    while (BigInt(gwei) !== 0n) {
      eth += gwei.charAt(0);
      gwei = gwei.substring(1);
    }
    return `${eth} ETH`;
  } else return `${gwei} Gwei`;
};
