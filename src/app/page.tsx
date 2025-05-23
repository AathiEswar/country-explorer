'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  capital: string[];
  flags: {
    png: string;
    alt?: string;
  };
  region: string;
  subregion: string;
  population: number;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  borders?: string[];
}

export default function Home() {
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch all countries to get unique regions
    fetch('https://restcountries.com/v3.1/all?fields=region')
      .then(res => res.json())
      .then((data: { region: string }[]) => {
        const uniqueRegions = Array.from(new Set(data.map(country => country.region))).sort();
        setRegions(uniqueRegions);
      });
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      setLoading(true);
      fetch(`https://restcountries.com/v3.1/region/${selectedRegion}`)
        .then(res => res.json())
        .then((data: Country[]) => {
          setCountries(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
          setLoading(false);
        });
    }
  }, [selectedRegion]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--card)] py-12">
      <main className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-6xl font-bold text-center mb-16 gradient-text">
          Explore the World
        </h1>
        
        <div className="glass-effect rounded-2xl p-8 mb-12">
          <label htmlFor="region" className="block text-lg font-medium text-[var(--foreground)] mb-4">
            Choose Your Destination
          </label>
          <select
            id="region"
            className="w-full p-4 bg-[var(--background)] border-2 border-[var(--border)] rounded-xl 
                     text-[var(--foreground)] text-lg shadow-lg
                     focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] 
                     transition-all duration-300 outline-none
                     hover:border-[var(--accent)] cursor-pointer"
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
            }}
          >
            <option value="">Select a region...</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {selectedRegion && (
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-4xl font-bold mb-8 gradient-text flex items-center gap-4">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              {selectedRegion}
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-64 bg-[var(--card)] rounded-xl loading-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {countries.map((country) => (
                  <div
                    key={country.cca2}
                    onClick={() => router.push(`/country/${country.cca2.toLowerCase()}`)}
                    className="group card-hover glass-effect rounded-xl overflow-hidden cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <Image 
                        src={country.flags.png} 
                        alt={country.flags.alt || `Flag of ${country.name.common}`}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4 group-hover:text-[var(--accent)] transition-colors">
                        {country.name.common}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-75"></span>
                          Capital: {country.capital?.[0] || 'N/A'}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-75"></span>
                          Population: {new Intl.NumberFormat().format(country.population)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
