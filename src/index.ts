import Jimp from "jimp";
import * as path from "path";
import { exec } from "child_process";
import * as fetch from "node-fetch";

const zipcodes = require("zipcodes");

const config = require("../config.json");
console.log(config);

const writeTo = path.resolve(__dirname, "../release/output.jpeg");
const readFrom = path.resolve(__dirname, "../bin/background.jpg");

async function getWeather() {
    const long = zipcodes.lookup("98112").longitude;
    const lat = zipcodes.lookup("98112").latitude;
    const coordinates = lat + "," + long;
    console.log(lat + "," + long);
    // https://api.darksky.net/forecast/c97761ffd9bcc7fb0da90ea426642e68/37.8267,-122.4233

    const weatherWords = await fetch.default("https://api.darksky.net/forecast/" + config.darkSkyKey + "/" + coordinates)
        .then(res => {
            return res.json();
        })
        .then((response) => {
            console.log(response.hourly.summary);
            return response.hourly.summary;
        });
    return weatherWords;
}

async function makeImage(image: Jimp, font: any) {
    image.print(font, 250, 200, await getWeather());
    image
        .write(writeTo);

    setBackground();
}

async function setBackground() {

    const osa = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${writeTo}"' && killall Dock`
    console.log(osa);
    exec(osa);
}

async function start() {
    console.log("started");
    const imageP = Jimp.read(readFrom);
    const fontP = Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

    Promise.all([imageP, fontP])
        .then(([image, font]) => {
            makeImage(image, font);
        })
}

start();
