'use client';

import Image from 'next/image';
import Search from './ui/search';
import { useEffect, useState } from 'react';
import { Location, Weather } from './lib/definitions';
import { fetchWeatherByCity, fetchWeatherByCoordinates } from './lib/data';
import moment from 'moment';
import {
  generateBackgroundImageUrl,
  generateWeatherIconUrl,
} from './lib/utils';
import { Switch } from '@headlessui/react';

export default function Page() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [term, setTerm] = useState('');
  const [unit, setUnit] = useState('metric');
  const [isNewLocation, setIsNewLocation] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!location) return;
      const weatherData = await fetchWeatherByCoordinates(location, 'metric');
      if (weatherData) {
        setWeather(weatherData);
      }
    }
    fetchData();
  }, [location]);

  async function handleUnitChange() {
    setEnabled(!enabled);
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
    const currentUnit = unit === 'metric' ? 'imperial' : 'metric';
    if (isNewLocation && weather) {
      const weatherData = await fetchWeatherByCity(weather.name, currentUnit);
      setWeather(weatherData);
    } else if (location) {
      const weatherData = await fetchWeatherByCoordinates(
        location,
        currentUnit
      );
      setWeather(weatherData);
    }
  }

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: weather
          ? `url('${generateBackgroundImageUrl(
              weather.weather[0].main,
              weather.sys.sunrise,
              weather.sys.sunset,
              weather.timezone
            )}')`
          : 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',
      }}>
      <div className="flex flex-col sm:flex-row w-full max-w-6xl h-full sm:h-3/4">
        <div className="text-white flex-none sm:w-3/5 p-6 sm:p-10 bg-gray-800 bg-opacity-75">
          <div className="flex justify-between">
            <div className="text-4xl sm:text-6xl">
              {weather ? weather.main.temp : '--'}
              {unit === 'metric' ? '°C' : '°F'}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={enabled}
                onChange={handleUnitChange}
                className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-500 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 data-[checked]:bg-gray-700">
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                />
              </Switch>
              <span className="text-xl">°F</span>
            </div>
          </div>

          <div className="text-xl sm:text-3xl">
            {weather ? weather.name : '--'}
          </div>
          <div className="text-sm sm:text-lg mt-2">
            {weather
              ? moment()
                  .utcOffset(weather.timezone / 60)
                  .format('HH:mm - dddd, D MMM YY')
              : '--:--'}
          </div>
          <div className="flex items-center">
            {weather && (
              <Image
                src={generateWeatherIconUrl(weather.weather[0].icon)}
                alt="weather icon"
                width={60}
                height={60}
                priority={true}
              />
            )}
            <span className="ml-2 capitalize">
              {weather ? weather.weather[0].description : '--'}
            </span>
          </div>
        </div>
        <div className="flex-1 bg-gray-900 text-white p-6 sm:p-10 bg-opacity-75 backdrop-blur-md">
          <Search
            setWeather={setWeather}
            setTerm={setTerm}
            term={term}
            setIsNewLocation={setIsNewLocation}
            unit={unit}
          />
          <div className="font-bold mb-2 mt-6">Weather Details</div>
          <div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Cloudy</span>
              <span>{weather ? weather.clouds.all + '%' : '--'}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Humidity</span>
              <span>{weather ? weather.main.humidity + '%' : '--'}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Wind</span>
              <span>
                {weather
                  ? weather.wind.speed + `${unit === 'metric' ? 'm/s' : 'mph'}`
                  : '--'}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Pressure</span>
              <span>{weather ? weather.main.pressure + 'mb' : '--'}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Rain</span>
              <span>
                {weather?.rain?.['1h'] ? `${weather.rain['1h']}mm` : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
