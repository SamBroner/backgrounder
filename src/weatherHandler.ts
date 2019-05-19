import * as fetch from "node-fetch";
import { IWeatherResponse } from './IWeatherResponse';
import * as path from "path";

const config = require("../config.json");

export interface IForecast {
    path: string;
    description: string;
}

export function getTime(unixTime: number): { hours: number, minutes: string, pm: boolean } {

    const date = new Date(unixTime);

    let hours = (date.getHours() % 12)
    hours = (hours === 0) ? 12 : hours;

    // Add 0 to minutes less than 10
    const minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes().toString();

    return {
        hours: hours,
        minutes: minutes,
        pm: (date.getHours() > 12)
    };
}

export async function getWeatherStrings(lat: number, long: number): Promise<IForecast[]> {

    const weather = await getWeather(lat, long);
    const hourly = weather.hourly.data;
    const forecastStrings: IForecast[] = new Array();

    for (let i = 0; i < 12; i++) {
        const hour = hourly[i];

        // Set to Unix Time
        const time = getTime(hour.time * 1000);
        const space = (time.hours < 10);

        const temp = hour.temperature.toPrecision(3) + String.fromCharCode(176);
        const rain = (hour.precipProbability * 100) < 10 ? (hour.precipProbability * 100).toPrecision(1) : (hour.precipProbability * 100).toPrecision(2);

        forecastStrings.push({
            path: pickWeatherPath(hour.icon),
            description: `${time.hours}${space ? "  " : ""}${time.pm ? "pm" : "am"} | ${temp} | Rain: ${rain}%`
        });
    }
    return forecastStrings;
}

async function getWeather(latitude: number, longitude: number): Promise<IWeatherResponse> {
    const coordinates = latitude + "," + longitude;

    return await fetch.default("https://api.darksky.net/forecast/" +
        config.darkSkyKey + "/" + coordinates)
        .then(res => {
            return res.json();
        });
}

function pickWeatherPath(icon: string): string {

    switch (icon) {
        case "clear-day": {
            return path.resolve(__dirname, "../bin/common/Sun.png");
        }
        case "clear-night": {
            return path.resolve(__dirname, "../bin/common/Moon.png");
        }
        case "rain": {
            return path.resolve(__dirname, "../bin/common/Cloud-Rain.png");
        }
        case "sleet":
        case "snow": {
            return path.resolve(__dirname, "../bin/common/Cloud-Snow.png");
        }
        case "wind": {
            return path.resolve(__dirname, "../bin/common/Wind.png");
        }
        case "fog": {
            return path.resolve(__dirname, "../bin/common/Cloud-Fog-Sun.png");
        }
        case "partly-cloudy-day": {
            return path.resolve(__dirname, "../bin/common/Cloud-Sun.png");
        }
        case "partly-cloudy-night": {
            return path.resolve(__dirname, "../bin/common/Cloud-Moon.png");
        }
        case "cloudy": { // TODO: Fix Image
            return path.resolve(__dirname, "../bin/common/Cloud-Fog-Sun.png");
        }
    }
}
