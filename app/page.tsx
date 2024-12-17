import Image from 'next/image';
import Search from './ui/search';

export default function Page() {
  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/rainy.jpg')` }}>
      <div className="flex w-full max-w-6xl h-3/4">
        <div className="text-white flex-none w-3/5 p-10 bg-gray-800 bg-opacity-75 ">
          <div className="text-6xl ">08°</div>
          <div className="text-3xl">London</div>
          <div className="text-lg mt-2">06:09 - Sunday, 6 Oct 19</div>
          <div className="flex items-center">
            <Image
              src="https://openweathermap.org/img/wn/10d@2x.png"
              alt="weather icon"
              width={100}
              height={100}
            />
            <span className="ml-2">Rainy</span>
          </div>
        </div>
        <div className="flex-1 bg-gray-900 text-white p-10 bg-opacity-75 backdrop-blur-md">
          <Search />
          <div className="mb-6">
            <ul>
              <li className="mb-2">Birmingham</li>
              <li className="mb-2">Manchester</li>
              <li className="mb-2">New York</li>
              <li className="mb-2">California</li>
            </ul>
          </div>
          <div className="font-bold mb-2">Weather Details</div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Cloudy</span>
              <span>86%</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Humidity</span>
              <span>86%</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Wind</span>
              <span>86%</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Rain</span>
              <span>8mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
