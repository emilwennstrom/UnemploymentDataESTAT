import React, { useEffect, useState } from "react";
import { fetchCountryData } from "../Network/Requests";
import { CountryData } from "../@types/types";

interface CountrySelectProps {
    onCountryChange: (country: CountryData | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ onCountryChange }) => {
    const [countryData, setCountryData] = useState<CountryData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await fetchCountryData();
            setCountryData(fetchedData);
        };
        fetchData();
    }, []);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedIsoCode = event.target.value;
        console.log(selectedIsoCode)

        const selectedCountry = countryData.find(
            (country) => country.iso_code === selectedIsoCode
        );

        if (selectedCountry) {
            onCountryChange(selectedCountry);
        } else {
            onCountryChange(null)
        }
    };

    return (
        <React.Fragment>
            <select onChange={handleSelectChange}>
                <option value="">Select a country</option>
                {countryData.map((value, index) => (
                    <option key={index} value={value.iso_code}>
                        {value.iso_code}
                    </option>
                ))}
            </select>
        </React.Fragment>
    );
};

export default CountrySelect;
