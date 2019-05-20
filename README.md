# Backgrounder

A simple node app to embed weather into your MacOS wallpaper.

Dark-Sky key not included, I'll need to figure out some way handling their requirements. You can get your own here: https://darksky.net/

## Set up
### Start
Run the following and then walk through the command prompt. To change the zip code just run this again.

    npm install
    npm run start
  

### Test
To test or debug backgrounder use the following:

    npm install
    npm run test
    
## Background Info

### Weather API
We're using the Dark Sky API to power our forecasts.

### Notes on the Chron job

#### This all happens as part of the prompt script, but the below is here because it's interesting!

To run as a background task, you'll need to use launchd and a tweek an included plist file.

Look at [com.launched.weathergenerator.plist](./bin/com.launched.weathergenerator.plist) 

* Swap the WorkingDirectory, StandardOutPath, and StandardErrorPath to root of your clone of this git repo
* Change the "ProgramArguments" string to point to npm (use "which npm" in terminal for the path)

Once you've updated your plist, you'll have to copy the file into ~/Library/LaunchAgents. There are other directories that have launchd plist files, but this dir is user specific

To start the task, run the following

    launchctl load  ~/Library/LaunchAgents/com.launched.weathergenerator.plist


If it's broken, or misbehaving you can remove it using this

    launchctl unload  ~/Library/LaunchAgents/com.launched.weathergenerator.plist

