import { WeatherCondition } from './definitions';

export function generateWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function generateBackgroundImageUrl(main: WeatherCondition) {
  const backgrounds: Record<WeatherCondition, string> = {
    Thunderstorm: '/thunderstorm.jpg',
    Drizzle: '/rain.jpg',
    Rain: '/rain.jpg',
    Snow: '/snow.jpg',
    Clear: '/clear.jpg',
    Clouds: '/clouds.jpg',
    Atmosphere: '/mist.jpg',
  };
  return backgrounds[main] || '/clear.jpg';
}
