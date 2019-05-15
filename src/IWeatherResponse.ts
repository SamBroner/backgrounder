import { IWeatherMinutely } from './IWeatherResponse';

export interface IWeatherResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    currently: IWeatherCurrently;
    minutely: IWeatherMinutely;
    hourly: IWeatherHourly;
    daily: IWeatherDaily;
    flags: any;
    offset: any;
}

export interface IWeatherCurrently {
    time: number;
    summary: string;
    icon: string;
    nearestStormDistance: number;
    precipIntensity: number;
    precipIntensityError: number;
    precipProbability: number;
    precipType: number;
    temperature: number;
    apparentTemperature: number;
    dewPoint: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windGust: number;
    windBearing: number;
    cloudCover: number;
    uvIndex: number;
    visibility: number;
    ozone: number;
}

export interface IWeatherByTime {
    type: "Minutely";
}

export interface IWeatherMinutely {
    summary: string;
    icon: string;
    data: IWeatherMinutelyData[];
}

export interface IWeatherMinutelyData {
    time: number;
    precipIntensity: number;
    precipIntensityError: number;
    precipProbability: number;
    precipType: string;
}

export interface IWeatherMinutelyData {

}

export interface IWeatherHourly {
    summary: string;
    icon: string;
    data: IWeatherHourlyData[];
}

export interface IWeatherHourlyData {
    time: number;
    summary: string;
    icon: string;
    precipIntensity: number;
    precipProbability: number;
    temperature: number;
    apparentTemperature: number;
    dewPoint: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windGust: number;
    windBearing: number;
    cloudCover: number;
    uvIndex: number;
    visibility: number;
    ozone: number;
}

export interface IWeatherDaily {
    summary: string;
    icon: string;
    data: IWeatherDailyData[];
}

export interface IWeatherDailyData {
    time: number;
    summary: string;
    icon: string;
    sunriseTime: number;
    sunsetTime: number;
    moonPhase: number;
    precipIntensity: number;
    precipIntensityMax: number;
    precipIntensityMaxTime: number;
    precipProbability: number;
    precipAccumulation: number;
    precipType: number;
    temperatureHigh: number;
    temperatureHighTime: number;
    temperatureLow: number;
    temperatureLowTime: number;
    apparentTemperatureHigh: number;
    apparentTemperatureHighTime: number;
    apparentTemperatureLow: number;
    apparentTemperatureLowTime: number;
    dewPoint: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windBearing: number;
    cloudCover: number;
    uvIndex: number;
    uvIndexTime: number;
    visibility: number;
    temperatureMin: number;
    temperatureMinTime: number;
    temperatureMax: number;
    temperatureMaxTime: number;
    apparentTemperatureMin: number;
    apparentTemperatureMinTime: number;
    apparentTemperatureMax: number;
    apparentTemperatureMaxTime: number;
}
