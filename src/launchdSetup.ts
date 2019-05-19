import * as path from "path";
import * as fs from "fs";
import { exec } from "child_process";
var which = require('which')

const templateLocation = path.resolve(__dirname, "../bin/com.template.plist");
const writeLocation =  path.join(process.env.HOME, "Library/LaunchAgents/com.launched.weathergenerator.plist");

export async function movePlistFile(zip: number) {
    const templateP = new Promise((resolve, reject) => {
        fs.readFile(templateLocation,
            (error, buffer) => {
                if (error) {
                    throw error;
                } else {
                    let template = buffer.toString();
                    template = template.replace(/xxxxxxxxx/g, __dirname);
                    template = template.replace(/zzzzzzzzz/g, zip.toString());

                    which("node", (error: any, path: any) => {
                        if (error) {
                            reject(error);
                        } else {
                            template = template.replace(/yyyyyyyyy/g, path);
                            resolve(template);
                        }
                    })
                }
            })
    });
    
    // This template has the correct dir name and stuff
    fs.writeFile(writeLocation, await templateP, (err) => {
        if (err) {
            throw err;
        } else {            
            exec(`launchctl load ${writeLocation}`);
        }
    })

}