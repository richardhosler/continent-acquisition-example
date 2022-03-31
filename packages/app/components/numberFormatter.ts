export const numberFormatter = (
  number: number | string | undefined
): string => {
  if (number === undefined) {
    return "0";
  }
  if (typeof number === "number") {
    number = number.toString();
  }
  return number.replace(/(.)(?=(\d{3})+$)/g, "$1,");
};
