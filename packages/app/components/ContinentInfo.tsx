import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { getContinentName } from "../utils/getContinentName";
import { FlagDisplay } from "./FlagDisplay";
import { numberFormatter } from "../utils/numberFormatter";

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
  fieldList = ["population", "area", "region"],
  className,
}: ContinentInfoInterface) => {
  const fetchURL = `https://restcountries.com/v3.1/region/${getContinentName({
    continentSelected,
  })}`;
  const { data } = useQuery<CountryInterface[], Error>(
    ["Region", continentSelected],
    () => fetch(fetchURL).then((res) => res.json())
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
  const currencyObjects = data?.map((country) => country.currencies);

  let classes = twMerge("h-80 space-y-3", className);
  return (
    <div className={classes}>
      <div className="text-5xl">{data && data[0].region}</div>

      {fieldList.find((field) => field === "population") && (
        <div>
          Population
          <div className="font-semibold text-2xl">
            {numberFormatter(population)}
          </div>
        </div>
      )}

      {fieldList.find((field) => field === "area") && (
        <div>
          Area (km{"\u00B2"})
          <div className="font-semibold text-2xl">{numberFormatter(area)}</div>
        </div>
      )}

      {fieldList.find((field) => field === "flags") && flags && (
        <div>
          Flags:
          <FlagDisplay flags={flags} className="px-2" />
        </div>
      )}

      {fieldList.find((field) => field === "currencies") && (
        <div>Currencies:&nbsp;{}</div>
      )}
    </div>
  );
};
