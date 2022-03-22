export const getContinentId = (continentName: string): number | undefined => {
    switch (continentName) {
        case "Africa":
            return 0;
        case "Antarctica":
            return 1;
        case "Asia":
            return 2;
        case "Europe":
            return 3;
        case "North America":
            return 4;
        case "Oceania":
            return 5;
        case "South America":
            return 6;
    }
}
