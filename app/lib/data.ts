import { Weather } from './definitions';

const weatherKey = process.env.WEATHER_API_KEY;

export async function fetchWeather(city: string): Promise<Weather | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}`
    );
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
