# Finger.Farm Modern Finger Hosting
https://finger.farm

Originally conceived as a way to get a status report on someone or something, the Finger Protocol aka RFC-742, has been around since the late 70s. Even today, the capability to finger lies dormant in every major OS.

Once upon a time, you could finger your boss, finger a vending machine, finger the weather, finger John Carmack, etc... Users would share .project and .plan files, showing their current project and plans. The original telepresence. The original Internet of Things. The original microblogging.

Although it's fallen out of fashion, finger still works and still has a valid purpose. Finger.Farm breathes new life into an ancient protocol, bringing the advanced finger features and finger functions into the future.

## Usage
* Open your Mac / Windows / Linux terminal
* Type:
`finger jroig@finger.farm`
* Profit

## Features
* Node.js implementation a Finger server
* CORS / REST API endpoints
* UPDATE via CURL
* SQLite Backend
* Twitter / GitHub login integration w/Passport


# Startup
`npm install`

`node index.js`

... or, even better: `pm2 start index.js` (if you're into that kinda thing)

You will almost certainly want to run this behind HAProxy.
