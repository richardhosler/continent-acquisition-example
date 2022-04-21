export const convertStringToByteArray = (text: string): Uint8Array => {
  let result = new Uint8Array(text.length);

  text.split("").forEach((character, key) => {
    result[key] = character.charCodeAt(0);
  });

  return result;
};
