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
  const classes = twMerge("text-stone-800 space-y-5", className);
  return (
    <div className={classes}>
      <div className="text-5xl">{data && data[0].region}</div>
      <div>
        Population:&nbsp;
        <span className="font-semibold text-2xl">
          {numberFormatter(population)}
        </span>
      </div>
      <div>
        Area (km<span className="text-xs align-super">2</span>):&nbsp;
        <span className="font-semibold text-2xl">{numberFormatter(area)}</span>
      </div>
      {flags ? (
        <div>
          Flags:&nbsp;
          <FlagDisplay
            flags={flags}
            className="bg-slate-300 px-2 pb-1 rounded-md"
          />
        </div>
      ) : null}
    </div>
  );
};
