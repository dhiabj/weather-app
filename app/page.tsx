'use client';

import Image from 'next/image';
import Search from './ui/search';
import { useEffect, useState } from 'react';
import { Location, Weather } from './lib/definitions';
import { fetchWeatherByCoordinates } from './lib/data';
import moment from 'moment';
import {
  generateBackgroundImageUrl,
  generateWeatherIconUrl,
} from './lib/utils';

export default function Page() {
  const [location, setLocation] = useState<Location>();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [dateTime, setDateTime] = useState(moment());

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherByCoordinates(location).then((weather) => {
        setWeather(weather);
      });
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: weather
          ? `url('${generateBackgroundImageUrl(weather.weather[0].main)}')`
          : 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(2,37,78,1) 0%, rgba(4,56,126,1) 19.7%, rgba(85,245,221,1) 100.2% )',
      }}>
      <div className="flex w-full max-w-6xl h-3/4">
        <div className="text-white flex-none w-3/5 p-10 bg-gray-800 bg-opacity-75 ">
          <div className="text-6xl ">
            {weather ? weather?.main.temp : '--'}°C
          </div>
          <div className="text-3xl">{weather?.name}</div>
          <div className="text-lg mt-2">
            {dateTime.format('HH:mm - dddd, D MMM YY')}
          </div>
          <div className="flex items-center">
            {weather && (
              <Image
                src={generateWeatherIconUrl(weather?.weather[0].icon)}
                alt="weather icon"
                width={100}
                height={100}
                priority={true}
              />
            )}
            <span>{weather ? weather?.weather[0].main : '--'}</span>
          </div>
        </div>
        <div className="flex-1 bg-gray-900 text-white p-10 bg-opacity-75 backdrop-blur-md">
          <Search setWeather={setWeather} />
          <div className="font-bold mb-2 mt-6">Weather Details</div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Cloudy</span>
              <span>{weather ? weather?.clouds.all + '%' : '--'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Humidity</span>
              <span>{weather ? weather?.main.humidity + '%' : '--'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Wind</span>
              <span>{weather ? weather?.wind.speed + 'km/h' : '--'}</span>
            </div>
            <div className="mb-2 flex justify-between">
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
