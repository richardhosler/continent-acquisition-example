import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { map } from "zod";
import { getContinentName } from "../utils/getContinentName";
import { FlagDisplay } from "./FlagDisplay";
import { numberFormatter } from "./numberFormatter";

interface ContinentInfoInterface {
  continentSelected: string;
  fieldList?: string[];
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
  fieldList = [
    "population",
    "area",
    "currencies",
    "languages",
    "flags",
    "region",
  ],
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
  const currencyObjects = data?.map((country) => country.currencies);
  console.log(currencyObjects);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  const classes = twMerge("text-stone-800 space-y-3", className);
  return (
    <div className={classes}>
      <div className="text-5xl">{data && data[0].region}</div>
      {fieldList.find((field) => field === "population") && (
        <div>
          Population:&nbsp;
          <span className="font-semibold text-2xl">
            {numberFormatter(population)}
          </span>
        </div>
      )}
      {fieldList.find((field) => field === "area") && (
        <div>
          Area (km<span className="text-xs align-super">2</span>):&nbsp;
          <span className="font-semibold text-2xl">
            {numberFormatter(area)}
          </span>
        </div>
      )}
      {fieldList.find((field) => field === "flags") && flags && (
        <div>
          Flags:&nbsp;
          <FlagDisplay
            flags={flags}
            className="bg-slate-300 px-2 pb-1 rounded-md"
          />
        </div>
      )}
      {fieldList.find((field) => field === "currencies") && (
        <div>Currencies:&nbsp;{}</div>
      )}
    </div>
  );
};
