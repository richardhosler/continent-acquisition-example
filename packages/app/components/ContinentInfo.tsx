import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getContinentName } from '../utils/getContinentName';

interface ContinentInfoInterface {
    continentSelected: string;
}
interface CountryInterface {
    name: string;
    capital: string;
    population: number;
    area: number;
    currencies: string[];
    languages: string[];
    flag: string;
    region: string;
}
export const ContinentInfo = ({ continentSelected }: ContinentInfoInterface) => {
    const fetchURL = `https://restcountries.com/v3.1/region/${getContinentName({ continentSelected })}`;
    const { isFetching, isLoading, error, data } = useQuery<CountryInterface[], Error>(['Region', continentSelected], () =>
        fetch(fetchURL).then(res => res.json())
    )

    const population = data?.map((country) => country.population).reduce((a: number, b: number) => a + b, 0);

    if (isFetching) {
        return <div>Fetching</div>
    }
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error</div>
    }
    return (
        <>
            <div>{data && data[0].region}</div>
            <div>Population: {population}</div>
        </>
    )

}
