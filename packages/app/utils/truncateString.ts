export interface TruncateStringInterface {
  text: string;
  prefix?: number;
  suffix?: number;
}

export const truncateString = ({
  text,
  prefix = 5,
  suffix = 4,
}: TruncateStringInterface): string => {
  const length = text.length;

  if (prefix + suffix >= length) {
    return text;
  }

  return `${text.slice(0, prefix)}...${text.slice(length - suffix, length)}`;
};
