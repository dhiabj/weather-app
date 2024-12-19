import { toast } from 'react-toastify';
import { Location, Weather } from './definitions';

const weatherKey = process.env.NEXT_PUBLIC_WEATHER_API;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchWeatherByCity(
  city: string,
  unit: string
): Promise<Weather | null> {
  try {
    const response = await fetch(
      `${baseURL}/weather?q=${city}&appid=${weatherKey}&units=${unit}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        toast.error('City weather not found.', { theme: 'colored' });
      }
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data: Weather = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function fetchWeatherByCoordinates(
  location: Location,
  unit: string
): Promise<Weather | null> {
  const { latitude, longitude } = location;
  try {
    const response = await fetch(
      `${baseURL}/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}&units=${unit}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data: Weather = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
