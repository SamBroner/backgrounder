import { IWeatherResponse, IWeatherHourlyData } from './IWeatherResponse';
import Jimp from "jimp";
import * as path from "path";
import { exec } from "child_process";
import * as fetch from "node-fetch";

const zipcodes = require("zipcodes");
const config = require("../config.json");

const writeTo = path.resolve(__dirname, "../release/output.jpeg");
const readFrom = path.resolve(__dirname, "../bin/background.jpg");

const TextStart = 300;
const SVGStart = 250;

async function getWeather(zipcode: number): Promise<IWeatherResponse> {
    const zipcodeInfo = zipcodes.lookup(zipcode);
    const long = zipcodeInfo.longitude;
    const lat = zipcodeInfo.latitude;
    const coordinates = lat + "," + long;
    console.log(lat + "," + long);

    return await fetch.default("https://api.darksky.net/forecast/" + 
            config.darkSkyKey + "/" + coordinates)
        .then(res => {
            return res.json();
        });
}

async function makeImage(image: Jimp, font: any, weather: string, hourly: IWeatherHourlyData[]) {
    image.print(font, TextStart, 200, weather);

    for (let i = 0; i < 12; i++) {
        const date = new Date(hourly[i].time*1000);
        const hours = (date.getHours() % 12);
        const pm = (date.getHours() > 12)
        const space = (hours < 10);
        console.log(hourly[i].summary);
        pickWeather(hourly[i].icon);
        image.print(font, TextStart, 200 + (i + 1)*100, `${hours} ${space ? "  ": ""} ${pm ? "PM" : "AM"} Temp: ${hourly[i].temperature}... Rain: ${hourly[i].precipProbability}`);
    }
    image
        .write(writeTo);

    setBackground();
}

async function setBackground() {

    const osa = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${writeTo}"' && killall Dock`
    // const osa = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${writeTo}"'`;

    console.log(osa);
    exec(osa);
}

function pickWeather(icon: string): string {

    switch(icon) {
        case "clear-day": {
            return path.resolve(__dirname, "../bin/Sun.svg");
        }
        case "clear-night": {
            return path.resolve(__dirname, "../bin/Moon.svg");
        }
        case "rain": {
            return path.resolve(__dirname, "../bin/Cloud-Rain.svg");
        }
        case "sleet":
        case "snow": {
            return path.resolve(__dirname, "../bin/Cloud-Snow.svg");
        }
        case "wind": {
            return path.resolve(__dirname, "../bin/Wind.svg");
        }
        case "fog": {
            return path.resolve(__dirname, "../bin/Cloud-Fog-Sun.svg");
        }
        case "partly-cloudy-day": {
            return path.resolve(__dirname, "../bin/Cloud-Sun.svg");
        }
        case "partly-cloudy-night": {
            return path.resolve(__dirname, "../bin/Cloud-Moon.svg");
        }
    }
}

async function start() {
    const imageP = Jimp.read(readFrom);
    const fontP = Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    const weather = await getWeather(98112);
    const hourlyData = weather.hourly.data;

    Promise.all([imageP, fontP])
        .then(([image, font]) => {
            makeImage(image, font, weather.currently.summary, hourlyData);
        })
}

start();
