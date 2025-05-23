'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CountryDetails {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  borders?: string[];
  flags: {
    png: string;
    alt?: string;
  };
  maps: {
    googleMaps: string;
  };
  timezones: string[];
  continents: string[];
  coatOfArms: {
    png: string;
    svg: string;
  };
  states?: { [key: string]: { name: string; capital?: string } };
}

export default function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const [country, setCountry] = useState<CountryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${resolvedParams.code}`)
      .then(res => res.json())
      .then((data) => {
        const countryData = Array.isArray(data) ? data[0] : data;
        console.log('Country Data:', countryData);
        console.log('Coat of Arms:', countryData.coatOfArms);
        setCountry(countryData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching country details:', error);
        setLoading(false);
      });
  }, [resolvedParams.code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--card)] flex items-center justify-center">
        <div className="loading-pulse w-64 h-64 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--card)] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6 gradient-text">Country not found</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--card)] py-12">
      <main className="container mx-auto px-4 max-w-7xl">
        <button
          onClick={() => router.back()}
          className="mb-8 px-6 py-3 bg-[var(--accent)] text-white rounded-xl hover:opacity-90 
                   transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          ← Back to Countries
        </button>

        <div className="glass-effect rounded-2xl overflow-hidden">
          <div className="relative h-96 overflow-hidden">
            <Image
              src={country.flags.png}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {country.name.common}
              </h1>
              <p className="text-2xl text-gray-200">{country.name.official}</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold gradient-text mb-4">General Information</h2>
                  <div className="space-y-3">
                    <p className="flex items-center gap-3 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                      Capital: {country.capital?.[0] || 'N/A'}
                    </p>
                    <p className="flex items-center gap-3 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                      Region: {country.region}
                    </p>
                    <p className="flex items-center gap-3 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                      Subregion: {country.subregion || 'N/A'}
                    </p>
                    <p className="flex items-center gap-3 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                      Population: {new Intl.NumberFormat().format(country.population)}
                    </p>
                    <p className="flex items-center gap-3 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                      Continent: {country.continents.join(', ')}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold gradient-text mb-4">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {country.languages && Object.values(country.languages).map((language) => (
                      <span
                        key={language}
                        className="px-4 py-2 bg-[var(--card)] text-gray-300 rounded-xl border border-[var(--border)] 
                                hover:border-[var(--accent)] transition-colors duration-300"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold gradient-text mb-4">Additional Details</h2>
                  <div className="space-y-3">
                    <p className="text-gray-300">Timezones: {country.timezones.join(', ')}</p>
                    {country.maps?.googleMaps && (
                      <a
                        href={country.maps.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-xl 
                                hover:opacity-90 transition-all duration-300 transform hover:scale-105 mt-2"
                      >
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold gradient-text mb-4">Currencies</h2>
                  <div className="space-y-2">
                    {country.currencies && Object.entries(country.currencies).map(([code, currency]) => (
                      <div
                        key={code}
                        className="px-4 py-3 bg-[var(--card)] rounded-xl border border-[var(--border)] text-gray-300"
                      >
                        <span className="font-medium">{currency.name}</span>
                        <span className="text-[var(--accent)]"> ({currency.symbol})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {country.borders && country.borders.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Bordering Countries</h2>
                <div className="flex flex-wrap gap-3">
                  {country.borders.map((border) => (
                    <button
                      key={border}
                      onClick={() => router.push(`/country/${border.toLowerCase()}`)}
                      className="px-4 py-2 bg-[var(--card)] text-gray-300 rounded-xl border border-[var(--border)] 
                              hover:border-[var(--accent)] transition-all duration-300 transform hover:scale-105"
                    >
                      {border}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {country.coatOfArms?.png && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold gradient-text mb-6">Coat of Arms</h2>
                <div className="flex justify-center relative h-48 w-full">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mt-2">Coat of arms not available</p>
                      </div>
                    </div>
                    <img
                      src={country.coatOfArms.png}
                      alt={`Coat of Arms of ${country.name.common}`}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 