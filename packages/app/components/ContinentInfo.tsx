import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { getContinentName } from "../utils/getContinentName";
import { FlagDisplay } from "./FlagDisplay";
import { numberFormatter } from "./numberFormatter";

interface ContinentInfoInterface {
  continentSelected: string;
  className?: string;
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
  className,
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

  const population =
    data &&
    Math.floor(
      data
        .map((country) => country.population)
        .reduce((a: number, b: number) => a + b, 0)
    );
  const area =
    data &&
    Math.floor(
      data
        .map((country) => country.area)
        .reduce((a: number, b: number) => a + b, 0)
    );
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
  const classes = twMerge("", className);
  return (
    <div className="max-w-md mx-auto md:max-w-2xl float-left space-y-2">
      <div className="text-stone-800 text-5xl">{data && data[0].region}</div>
      <div>Population: {numberFormatter(population)}</div>
      <div>Area:{numberFormatter(area)}</div>
      {flags ? (
        <div>
          Flags:{" "}
          <FlagDisplay
            flags={flags}
            className="bg-slate-300 px-2 pb-1 rounded-md"
          />
        </div>
      ) : null}
    </div>
  );
};
