export interface CurrencyInterface {
  amount?: string;
  symbol?: string;
}
export const gweiFormatter = (gwei: string | undefined): CurrencyInterface => {
  if (gwei === undefined || gwei === "undefined") {
    return {};
  }
  while (gwei.length < 18) {
    gwei = "0" + gwei;
  }
  if (gwei.length > 5) {
    let eth = "0.";
    while (BigInt(gwei) !== 0n) {
      eth += gwei.charAt(0);
      gwei = gwei.substring(1);
    }
    return { amount: eth, symbol: "ETH" };
  } else return { amount: gwei, symbol: "Gwei" };
};
