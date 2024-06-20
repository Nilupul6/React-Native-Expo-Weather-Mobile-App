import axios from 'axios';
import { apiKey } from '../constants';

const forecastEndpoint = params => `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=7&aqi=no&alerts=no`
const locationEndpoint = params => `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async(endpoint)=>{
    const option = {
        method: 'GET',
        url: endpoint
    }
    try {
        const response = await axios.request(option);
        return response.data;
    } catch (error) {
        console.log('error : ',error);
        return null;
    }
}

export const fetchWeatherForecast = params =>{
    return apiCall(forecastEndpoint(params));
}

export const fetchWeatherLocation = params =>{
    return apiCall(locationEndpoint(params));
}
