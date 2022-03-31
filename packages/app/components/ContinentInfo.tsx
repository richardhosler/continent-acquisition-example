import { useQuery } from "react-query";
import { getContinentName } from "../utils/getContinentName";
import { numberFormatter } from "./numberFormatter";

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
export const ContinentInfo = ({
  continentSelected,
}: ContinentInfoInterface) => {
  const fetchURL = `https://restcountries.com/v3.1/region/${getContinentName({
    continentSelected,
  })}`;
  const { isFetching, isLoading, error, data } = useQuery<
    CountryInterface[],
    Error
  >(["Region", continentSelected], () =>
    fetch(fetchURL).then((res) => res.json())
  );

  const population = data
    ?.map((country) => country.population)
    .reduce((a: number, b: number) => a + b, 0);
  const flags = data?.map((country) => country.flag);
  if (isFetching) {
    return <div>Fetching...</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  return (
    <div className="max-w-md mx-auto md:max-w-2xl">
      <div className="text-stone-800 text-5xl">{data && data[0].region}</div>
      <div>Population: {numberFormatter(population)}</div>
      <div>Flags: {flags && flags.length}</div>
    </div>
  );
};
