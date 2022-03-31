interface convertStringToByteArrayInterface {
  s: string;
}
export const convertStringToByteArray = ({
  s,
}: convertStringToByteArrayInterface): Uint8Array => {
  var result = new Uint8Array(s.length);
  for (var i = 0; i < s.length; i++) {
    result[i] = s.charCodeAt(i);
  }
  return result;
};
