import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { getContinentName } from "../utils/getContinentData";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { numberFormatter } from "../utils/numberFormatter";
import { CountryInterface } from "../utils/restCountriesInterface";
import colors from "tailwindcss/colors";

interface ContinentInfoInterface {
  continentSelected: string;
  fieldList?: string[];
  className?: string;
}

export const ContinentInfo = ({
  continentSelected,
  fieldList = ["population", "area", "region"],
  className,
}: ContinentInfoInterface) => {
  const fetchURL = `https://restcountries.com/v3.1/region/${getContinentName({
    continentSelected,
  })}`;
  const { data, isLoading } = useQuery<CountryInterface[], Error>(
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
  const currencyObjects = data?.map((country) => country.currencies);
  let classes = twMerge("h-80 space-y-3 bg-white", className);

  return (
    <div className={classes}>
      <SkeletonTheme baseColor={colors.slate[600]}>
        <div className="text-4xl">
          {isLoading ? (
            <Skeleton className="opacity-20" />
          ) : data && data[0].subregion !== "Eastern Europe" ? (
            data[0].subregion
          ) : (
            data && data[0].region
          )}
        </div>

        {fieldList.find((field) => field === "population") && (
          <div>
            Population
            <div className="font-semibold text-2xl">
              {isLoading ? (
                <Skeleton className="opacity-20" />
              ) : (
                numberFormatter(population)
              )}
            </div>
          </div>
        )}

        {fieldList.find((field) => field === "area") && (
          <div>
            Area (km{"\u00B2"})
            <div className="font-semibold text-2xl">
              {isLoading ? (
                <Skeleton className="opacity-20" />
              ) : (
                numberFormatter(area)
              )}
            </div>
          </div>
        )}
      </SkeletonTheme>
    </div>
  );
};
