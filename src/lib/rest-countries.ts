interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  borders?: string[];
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

interface CountriesByContinent {
  [key: string]: Country[];
}

const BASE_URL = 'https://restcountries.com/v3.1';

export async function fetchAllCountries(): Promise<Country[]> {
  const response = await fetch(`${BASE_URL}/all`);
  return response.json();
}

export async function fetchCountriesByRegion(region: string): Promise<Country[]> {
  const response = await fetch(`${BASE_URL}/region/${region}`);
  return response.json();
}

export async function fetchCountryByCode(code: string): Promise<Country> {
  const response = await fetch(`${BASE_URL}/alpha/${code}`);
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

export function groupCountriesByContinent(countries: Country[]): CountriesByContinent {
  return countries.reduce((acc: CountriesByContinent, country: Country) => {
    const continent = country.region || 'Other';
    if (!acc[continent]) {
      acc[continent] = [];
    }
    acc[continent].push(country);
    return acc;
  }, {});
} 