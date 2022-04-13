import africaImage from "../public/images/africa.jpg";
import asiaImage from "../public/images/asia.jpg";
import europeImage from "../public/images/europe.jpg";
import northAmericaImage from "../public/images/north-america.jpg";
import southAmericaImage from "../public/images/south-america.jpg";
import oceaniaImage from "../public/images/oceania.jpg";
export const getContinentId = (continentName: string): number => {
  switch (continentName) {
    case "Africa":
    case "AF":
      return 0;
    case "Asia":
    case "AS":
      return 1;
    case "Europe":
    case "EU":
      return 2;
    case "North America":
    case "NA":
      return 3;
    case "South America":
    case "SA":
      return 4;
    case "Oceania":
    case "OC":
      return 5;
    case "Antarctica":
    case "AN":
      return 6;
    default:
      return -1;
  }
};

export const getCoverImage = (ISO: string): StaticImageData | string => {
  const continentId = getContinentId(ISO);
  switch (continentId) {
    case 0:
      return africaImage;
    case 1:
      return asiaImage;
    case 2:
      return europeImage;
    case 3:
      return northAmericaImage;
    case 4:
      return southAmericaImage;
    case 5:
      return oceaniaImage;
    default:
      return " ";
  }
};
interface getContinentNameInterface {
  continentSelected: string;
}

export const getContinentName = ({
  continentSelected,
}: getContinentNameInterface): string | undefined => {
  switch (continentSelected) {
    case "AF":
      return "Africa";
    case "AN":
      return "Antarctica";
    case "AS":
      return "Asia";
    case "EU":
      return "Europe";
    case "NA":
      return "North America";
    case "OC":
      return "Oceania";
    case "SA":
      return "South America";
    default:
      return undefined;
  }
};
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
