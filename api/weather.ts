import axios from "axios";
import keys from '@/constants/Keys'

const forecastEndpoint = (param: any)=> `https://api.weatherapi.com/v1/forecast.json?key=${keys.API_KEY}&q=${param.cityName}&days=${param.days}&aqi=no&alerts=no`;

const locationsEndpoint = (param: any)=> `https://api.weatherapi.com/v1/search.json?key=${keys.API_KEY}&q=${param.cityName}`;

const apiCall = async (endpoint: string) => {
    const options = {
        method: 'GET',
        url: endpoint
    }

    try{
        const response = await axios.request(options);
        return response;
    } catch(e) {
        console.log(e)
    }
}



export const fetchWeatherForecast = (params: any) => {
    let forecastUrl = forecastEndpoint(params);
    return apiCall(forecastUrl);
}

export const fetchLocations = (params: any) => {
    let forecastUrl = locationsEndpoint(params);
    return apiCall(forecastUrl);
}