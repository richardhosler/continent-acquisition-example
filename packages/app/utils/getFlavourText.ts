export const flavourText = (ISO: string) => {
  switch (ISO) {
    case "AF":
      return "Africa is the largest of the three great southward projections from the largest landmass of the Earth. Separated from Europe by the Mediterranean Sea, it is joined to Asia at its northeast extremity by the Isthmus of Suez.";
    case "AS":
      return "Asia is the largest continent on Earth, at 9% of the Earth's total surface area, and has the longest coastline, at 62,800 kilometres. It is located to the east of the Suez Canal and the Ural Mountains, and south of the Caucasus Mountains and the Caspian and Black Seas.";
    case "EU":
      return "Europe has a higher ratio of coast to landmass than any other continent or subcontinent. Its maritime borders consist of the Arctic Ocean to the north, the Atlantic Ocean to the west and the Mediterranean, Black and Caspian Seas to the south.";
    case "NA":
      return "North America occupies the northern portion of the landmass generally referred to as the New World, the Western Hemisphere, the Americas, or simply America. North America is the third-largest continent by area, following Asia and Africa.";
    case "SA":
      return "South America occupies the southern portion of the Americas. The continent is generally delimited on the northwest by the Darién watershed along the Colombia–Panama border, although some may consider the border instead to be the Panama Canal.";
    case "OC":
      return "Under a standard four region model, the major islands of Oceania extend to New Guinea in the west, the Bonin Islands in the northwest, the Hawaiian Islands in the northeast, Easter Island and Sala y Gómez Island in the east, and Macquarie Island in the south.";
    default:
      return "";
  }
};
