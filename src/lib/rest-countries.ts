const BASE_URL = 'https://restcountries.com/v3.1';

export async function fetchAllCountries() {
  const response = await fetch(`${BASE_URL}/all`);
  return response.json();
}

export async function fetchCountriesByRegion(region: string) {
  const response = await fetch(`${BASE_URL}/region/${region}`);
  return response.json();
}

export async function fetchCountryByCode(code: string) {
  const response = await fetch(`${BASE_URL}/alpha/${code}`);
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

export function groupCountriesByContinent(countries: any[]) {
  return countries.reduce((acc: any, country: any) => {
    const continent = country.region || 'Other';
    if (!acc[continent]) {
      acc[continent] = [];
    }
    acc[continent].push(country);
    return acc;
  }, {});
} 