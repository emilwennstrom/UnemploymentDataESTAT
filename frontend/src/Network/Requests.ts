import { UnemployementData, CountryData } from '../@types/types';


const baseUrl = process.env.REACT_APP_BASE_URL;

export const fetchUnemployementData = async (iso_code: string): Promise<UnemployementData[]> => {

    const response = await fetch(`${baseUrl}/get-data?iso_code=${iso_code}`);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const transformedData: UnemployementData[] = result.map((item: any) => ({
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



