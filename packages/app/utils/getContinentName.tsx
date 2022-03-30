interface getContinentNameInterface {
    continentSelected: string;
}

export const getContinentName = ({ continentSelected }: getContinentNameInterface): string | undefined => {
    switch (continentSelected) {
        case 'AF':
            return 'Asia';
        case 'AN':
            return 'Antarctica';
        case 'AS':
            return 'Asia';
        case 'EU':
            return 'Europe';
        case 'NA':
            return 'North America';
        case 'OC':
            return 'Oceania';
        case 'SA':
            return 'South America';
        default:
            return undefined;
    }
}