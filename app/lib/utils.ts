import moment from 'moment';
import { WeatherCondition } from './definitions';

export function generateWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function generateBackgroundImageUrl(
  main: WeatherCondition,
  sunrise: number,
  sunset: number,
  timezone: number
) {
  const currentTime = moment()
    .utcOffset(timezone / 60)
    .unix();
  const isDay = currentTime >= sunrise && currentTime < sunset;
  const backgrounds: Record<WeatherCondition, string> = {
    Thunderstorm: '/thunderstorm.jpg',
    Drizzle: '/rain.jpg',
    Rain: '/rain.jpg',
    Snow: isDay ? '/snow.jpg' : '/snow_night.jpg',
    Clear: isDay ? '/clear.jpg' : '/clear_night.jpg',
    Clouds: isDay ? '/clouds.jpg' : '/clouds_night.jpg',
    Atmosphere: isDay ? '/fog.jpg' : '/fog_night.jpg',
  };
  return backgrounds[main] || (isDay ? '/clear_day.jpg' : '/clear_night.jpg');
}

export function celsiusToFahrenheit(celsius: number) {
  return (celsius * 9) / 5 + 32;
}
