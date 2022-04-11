export interface CountryInterface {
  name: {
    common: string;
    official: string;
    nativeName: { official: string; common: string }[];
  };
  capital: string[];
  population: number;
  area: number;
  currencies: currencyInterface;
  languages: {}[];
  flags: flagsInterface;
  subregion: string;
}
interface flagsInterface {
  png: string;
  svg: string;
}
interface currencyInterface {
  key: string;
  data: { name: string; symbol: string };
}
