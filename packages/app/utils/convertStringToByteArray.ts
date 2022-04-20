interface ConvertStringToByteArrayInterface {
  text: string;
}

export const convertStringToByteArray = ({
  text,
}: ConvertStringToByteArrayInterface): Uint8Array => {
  let result = new Uint8Array(text.length);

  for (var i = 0; i < text.length; i++) {
    result[i] = text.charCodeAt(i);
  }

  return result;
};
