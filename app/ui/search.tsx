'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Weather } from '../lib/definitions';
import { fetchWeatherByCity } from '../lib/data';

export default function Search({
  setWeather,
  setTerm,
  setIsNewLocation,
  term,
  unit,
}: {
  setWeather: (weather: Weather | null) => void;
  setTerm: (term: string) => void;
  setIsNewLocation: (isSearching: boolean) => void;
  term: string;
  unit: string;
}) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const existingHistory = JSON.parse(
      localStorage.getItem('searchHistory') || '[]'
    );
    setSearchHistory(existingHistory);
  }, []);

  async function fetchAndUpdateData(term: string) {
    const weatherData = await fetchWeatherByCity(term, unit);
    if (weatherData) {
      setWeather(weatherData);
      setIsNewLocation(true);
    }
  }

  async function handleSearch(term: string) {
    if (term.trim() === '') return;
    fetchAndUpdateData(term);
    const existingHistory = JSON.parse(
      localStorage.getItem('searchHistory') || '[]'
    );
    const updatedHistory = [...existingHistory, term];
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  }

  function handleDelete(indexToDelete: number) {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(indexToDelete, 1);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  }

  return (
    <>
      <div className="relative flex flex-1 flex-shrink-0 mb-6">
        <input
          type="text"
          value={term}
          placeholder="Another location"
          className="peer block w-full py-[9px] pl-10 bg-transparent border-b outline-none placeholder:text-gray-500 capitalize"
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(term);
            }
          }}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
      </div>
      <ul>
        {searchHistory.slice(-5).map((term, index) => (
          <li
            key={index}
            className="mb-2 flex items-center justify-between capitalize text-gray-400">
            <span
              className="cursor-pointer hover:text-white"
              onClick={() => {
                setTerm(term);
                fetchAndUpdateData(term);
              }}>
              {term}
            </span>
            <XMarkIcon
              className="h-4 w-4 cursor-pointer hover:text-white"
              onClick={() => handleDelete(index)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
