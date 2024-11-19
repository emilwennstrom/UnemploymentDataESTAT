import React, { useEffect, useState } from "react";
import { fetchCountryData } from "../Network/Requests";
import { CountryData } from "../@types/types";

interface CountrySelectProps {
    onCountryChange: (country: CountryData | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ onCountryChange }) => {
    const [countryData, setCountryData] = useState<CountryData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedData = await fetchCountryData();
                setCountryData(fetchedData);
            } catch (error) {
                console.error("Error fetching ISO-Codes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedIsoCode = event.target.value;

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
            {!loading && (
                <select onChange={handleSelectChange}>
                    <option>Select a country</option>
                    {countryData.map((value, index) => (
                        <option key={index} value={value.iso_code}>
                            {value.iso_code}
                        </option>
                    ))}
                </select>
            )}

        </React.Fragment>
    );
};

export default CountrySelect;
