import { IWeatherResponse, IWeatherHourlyData } from './IWeatherResponse';
import Jimp from "jimp";
import * as path from "path";
import { exec } from "child_process";
import * as fetch from "node-fetch";

const zipcodes = require("zipcodes");
const config = require("../config.json");

const writeTo = path.resolve(__dirname, "../release/output.jpeg");
const readFrom = path.resolve(__dirname, "../bin/background.jpg");

const TextStart = 550;
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
    for (let i = 0; i < 12; i++) {
        const hour = hourly[i];

        const date = new Date(hour.time*1000);
        let hours = (date.getHours() % 12)
        hours = (hours === 0 ) ? 12 : hours;
        const pm = (date.getHours() > 12)
        const space = (hours < 10);

        pickWeather(hour.icon);
        const height = 200 + i*175;
        image.print(font, TextStart, height, `${hours}${space ? "  ": ""}${pm ? "pm" : "am"}... ${hour.temperature.toPrecision(3)}${String.fromCharCode(176)}... Rain: ${(hour.precipProbability * 100).toPrecision(2)}%`);
        image.composite(await Jimp.read(pickWeather(hour.icon)), SVGStart, height - 120);
    }
    image
        .write(writeTo);

    setBackground();
}

async function setBackground() {
    const osa = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${writeTo}"' && killall Dock`
    exec(osa);
}

function pickWeather(icon: string): string {

    switch(icon) {
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
