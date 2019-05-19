import { prompt } from "enquirer";
import { movePlistFile } from "./launchdSetup";
import { changeBackground } from "./imageHandler";
const zipcodes = require("zipcodes");

export async function commandline() {

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
        const zip = (response as any).zip
        console.log(`Great, we'll give you the forecast for ${zip} in ${location}`);
        changeBackground(zip);

        console.log(`We set up a task to update the weather every hour.`);
        console.log(`Enjoy!`);
        movePlistFile(zip);

    } else {
        console.log("Well... see you later");
    }
}


commandline();