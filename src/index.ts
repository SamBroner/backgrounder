import Jimp from "jimp";
import * as path from "path";
import { exec } from "child_process";

const config = require("../config.json");
console.log(config);

const writeTo = path.resolve(__dirname, "../release/output.jpeg");
const readFrom = path.resolve(__dirname, "../bin/background.jpg");

async function getWeather() {

}

async function makeImage(image: Jimp, font: any) {
    image.print(font, 200, 200, "Now this is actualy is the overlaydddd");
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
