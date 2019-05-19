import Jimp from "jimp";
import * as path from "path";
import { IForecast, getWeatherStrings, getTime} from "./weatherHandler";
import { exec } from "child_process";
import { prompt } from "enquirer";
const zipcodes = require("zipcodes");

const writeTo = path.resolve(__dirname, "../release/output.jpeg");
const readFrom = path.resolve(__dirname, "../bin/background.jpg");

const ForecastStartY = 200;
const ForecastRowHeight = 175;
const TextStartX = 550;
const SVGStartX = 250;

async function makeImage(image: Jimp, font: any, forecast: IForecast[], city: string) {
    for (let i = 0; i < 12; i++) {
        const height = ForecastStartY + i * ForecastRowHeight;
        image.print(font, TextStartX, height, forecast[i].description);
        image.composite(await Jimp.read(forecast[i].path), SVGStartX, height - 120);
    }
    
    const date = Date.now();
    const time = getTime(date);
    image.print(await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK),
                TextStartX,
                ForecastStartY + 12 * ForecastRowHeight - 70,
                `Forecast for ${city} @ ${time.hours}:${time.minutes}`);
    image
        .write(writeTo);

    setBackground();
}

async function setBackground() {
    const osa = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${writeTo}"' && killall Dock`
    exec(osa);
}

export async function changeBackground(zipcode: number) {
    const imageP = Jimp.read(readFrom);
    const fontP = Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    const zipInfo = zipcodes.lookup(zipcode);

    const weatherP = getWeatherStrings(zipInfo.latitude, zipInfo.longitude);

    Promise.all([imageP, fontP, weatherP])
        .then(([image, font, weather]) => {
            makeImage(image, font, weather, `${zipInfo.city}, ${zipInfo.state}`)
                .then(() => setBackground()) // Actually change the background
                .catch((err) => console.error(err))
        })
}

async function start() {

    let location = "";
    const response = await prompt(
        [{
            type: 'numeral',
            name: 'zip',
            validate: (input: any) => {
                const zip = input as number;
                if (zip.toString().length === 5) {
                    const zipInfo = zipcodes.lookup(zip);
                    location = `${zipInfo.city}, ${zipInfo.state}`;
                    return true;
                } else {
                    return "Invalid US Zipcode. Please use one that's in the US and 5 digits";
                }
                return true;
            },
            message: 'What US, 5-Digit zipcode should we use for your forecast?'
        },
        {
            type: 'confirm',
            name: 'agreement',
            message: 'Are you cool with running this script every hour?'
        }]);

    if ((response as any).agreement) {
        console.log(`Great, we'll give you the forecast for ${location}`);
        console.log(`Enjoy!`);
        changeBackground((response as any).zip);

    } else {
        console.log("Well... see you later");
    }
}

// TODO: this is needed for the chron job
// We probably need to make the CLI create the chron
changeBackground(98112);