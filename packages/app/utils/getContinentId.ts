export const getContinentId = (continentName: string): number => {
    switch (continentName) {
        case "Africa":
        case "AF":
            return 0;
        case "Antarctica":
        case "AN":
            return 6;
        case "Asia":
        case "AS":
            return 1;
        case "Europe":
        case "EU":
            return 2;
        case "North America":
        case "NA":
            return 3;
        case "Oceania":
        case "OC":
            return 5;
        case "South America":
        case "SA":
            return 4;
        default:
            return -1;
    }
}
