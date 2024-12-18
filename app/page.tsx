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

  const isDayTime = dateTime.hour() >= 6 && dateTime.hour() < 18;

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: weather
          ? `url('${generateBackgroundImageUrl(
              weather.weather[0].main,
              isDayTime
            )}')`
          : 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',
      }}>
      <div className="flex flex-col sm:flex-row w-full max-w-6xl h-full sm:h-3/4">
        <div className="text-white flex-none sm:w-3/5 p-6 sm:p-10 bg-gray-800 bg-opacity-75">
          <div className="text-4xl sm:text-6xl">
            {weather ? weather?.main.temp : '--'}°C
          </div>
          <div className="text-xl sm:text-3xl">{weather?.name}</div>
          <div className="text-sm sm:text-lg mt-2">
            {dateTime.format('HH:mm - dddd, D MMM YY')}
          </div>
          <div className="flex items-center">
            {weather && (
              <Image
                src={generateWeatherIconUrl(weather?.weather[0].icon)}
                alt="weather icon"
                width={60}
                height={60}
                priority={true}
              />
            )}
            <span className="ml-2">
              {weather ? weather?.weather[0].main : '--'}
            </span>
          </div>
        </div>
        <div className="flex-1 bg-gray-900 text-white p-6 sm:p-10 bg-opacity-75 backdrop-blur-md">
          <Search setWeather={setWeather} />
          <div className="font-bold mb-2 mt-6">Weather Details</div>
          <div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Cloudy</span>
              <span>{weather ? weather?.clouds.all + '%' : '--'}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Humidity</span>
              <span>{weather ? weather?.main.humidity + '%' : '--'}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Wind</span>
              <span>{weather ? weather?.wind.speed + 'km/h' : '--'}</span>
            </div>
            <div className="mb-2 flex justify-between text-sm sm:text-base">
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
