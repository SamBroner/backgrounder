import Jimp from "jimp";
import * as path from "path";
import { IForecast, getWeatherStrings} from "./weatherHandler";
import { exec } from "child_process";

const writeTo = path.resolve(__dirname, "../release/output.jpeg");
const readFrom = path.resolve(__dirname, "../bin/background.jpg");

const TextStart = 550;
const SVGStart = 250;

async function makeImage(image: Jimp, font: any, forecast: IForecast[], city: string) {
    
    for (let i = 0; i < 12; i++) {
        const height = 200 + i*175;
        image.print(font, TextStart, height, forecast[i].description);
        image.composite(await Jimp.read(forecast[i].path), SVGStart, height - 120);
    }
    image
        .write(writeTo);

    setBackground();
}

async function setBackground() {
    const osa = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${writeTo}"' && killall Dock`
    exec(osa);
}

async function changeBackground(zipcode: number) {
    const imageP = Jimp.read(readFrom);
    const fontP = Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    const zipcodes = require("zipcodes");
    const zipInfo = zipcodes.lookup(zipcode);

    const weatherP = getWeatherStrings(zipInfo.latitude, zipInfo.longitude);

    Promise.all([imageP, fontP, weatherP])
        .then(([image, font, weather]) => {
            makeImage(image, font, weather, `${zipInfo.city}, ${zipInfo.state}`)
                .then(() => setBackground()) // Actually change the background
                .catch((err) => console.error(err))
        })
}

changeBackground(98112);
