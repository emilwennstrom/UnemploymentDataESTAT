import { UnemploymentData, CountryData } from '../@types/types';


const baseUrl = process.env.REACT_APP_BASE_URL;

export const fetchUnemploymentData = async (iso_code: string): Promise<UnemploymentData[]> => {

    const response = await fetch(`${baseUrl}/get-data?iso_code=${iso_code}`);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const transformedData: UnemploymentData[] = result.map((item: any) => ({
        sex: item["Sex"],
        time_period: item["Time period"],
        value: item.value
    }));

    return transformedData;
}


export const fetchCountryData = async (): Promise<CountryData[]> => {
    const response = await fetch(`${baseUrl}/get-iso-codes`)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result: CountryData[] = await response.json();
    return result;
}



