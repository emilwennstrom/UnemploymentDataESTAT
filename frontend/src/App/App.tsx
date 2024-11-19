import './App.css'
import BarChart from '../Components/BarChart';
import CountrySelect from '../Components/CountrySelect';
import { useState } from 'react';
import { CountryData } from '../@types/types';


function App() {

  const width = 1000;
  const height = 500;

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)

  const handleCountryChange = (country: CountryData | null) => {
    setSelectedCountry(country);
  }

  return (
    <div className='content'>
      <div className='country-select'>

        <div>
          {selectedCountry && (
            `Unemployement data for ${selectedCountry?.country}`
          )}



        </div>
        <CountrySelect onCountryChange={handleCountryChange}></CountrySelect>
      </div>
      <BarChart width={width} height={height} iso_code={selectedCountry ? selectedCountry.iso_code : null}></BarChart>

    </div >
  );

}

export default App;
