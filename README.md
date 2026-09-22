# Finger.Farm Modern Finger Protocol Hosting
https://finger.farm

Originally conceived as a way to get a status report on someone or something, the Finger Protocol aka RFC-742, has been around since the late 70s. Even today, the capability to finger lies dormant in every major OS.

Once upon a time, you could finger your boss, finger a vending machine, finger the weather, finger John Carmack, etc... Users would share .project and .plan files, showing their current project and plans. The original telepresence. The original Internet of Things. The original microblogging.

Although it's fallen out of fashion, finger still works and still has a valid purpose. Finger.Farm breathes new life into an ancient protocol, bringing the advanced finger features and finger functions into the future.

The finger CLI is still present on almost every major OS.

## Usage
* Open your Mac / Windows / Linux terminal
* Type: `finger jroig@finger.farm`
* Profit


## Features
* Node.js implementation of a Finger server
* CORS / REST API endpoints
* UPDATE via API
* Pluggable Database Backend (Default: SQLite)
* Dynamic Authentication via [Passport.js](https://www.passportjs.org/)
* Bot support / plugins
* Cloud ready


## Startup & Deployment

**Local Development:**
```bash
npm install
cp .env.example .env
node index.js
```


## Configuration
Finger.Farm runs without code modification.

Finger.Farm uses env for configuration. Take a look at the `.env.example` file to see how to set everything up.

You can copy `.env.example` to `.env` and fill in your values or configure your favorite node-running cloud thing to use those values as ENV vars. 

It should just work.

```bash
cp .env.example .env
```

**Production Deployment (VPS):**
When deploying to a VPS, you should use PM2 to run the application as a background daemon. We have included an `ecosystem.config.js` file specifically for this:

```bash
# Start the app in the background with production settings
pm2 start ecosystem.config.js --env production

# Save the process list so it automatically starts on server reboot
pm2 save
```

*Note: You will almost certainly want to run this behind a reverse proxy like Nginx or HAProxy. You will also need to use `iptables` to route the privileged Finger port (79) to the Node app (7979).*


## Local CLI Testing
Finger.Farm includes a built-in CLI tool to quickly test your local database and bot configurations without booting the entire server:
```bash
# Query a specific user or bot
node fingerfarm.js quotes@finger.farm

# View the directory of public users
node fingerfarm.js ""
```


### Bot Plugins
Finger.Farm supports simple bots - they're just js modules that respond to finger requests. We've got some basic examples:

```bash
finger about@finger.farm
finger echo@finger.farm
finger finger@finger.farm
finger help@finger.farm
finger info@finger.farm
finger quotes@finger.farm
```

[Bot interface / examples](bots/README.md)


### oAuth Providers
Authentication powered by [Passport.js](https://www.passportjs.org/). Supports most of the the most popular OAuth2 providers including GitHub, Google, Discord, Reddit, Slack. 

Add the appropriate API secrets and keys to your `.env` to enable an oAuth provider. Adding new oAuth providers is pretty straightforward should you require enterprise finger support.

[Authentication providers / instructions](auth/README.md)


### Database Adapters
Finger.Farm ships with support for SQLite, PostgreSQL, MySQL, MongoDB, Supabase, Redis, and Firebase all configured via `.env`. It supports custom adapters - there's just a basic pattern to follow.

Switch to a different database:
1. Change `DB_TYPE` in your `.env` file (e.g. `DB_TYPE=postgres`)
2. Fill in the corresponding connection string in your `.env` file
3. Restart the server

[Supported databases / custom adapters](lib/db/README.md)


## WebFinger Support
Finger.Farm support all the fingers, including WebFinger (RFC-7033), the modern HTTP-based spiritual successor to the Finger protocol.

WebFinger searches `@jroig@finger.farm` automatically hit `https://finger.farm/.well-known/webfinger?resource=acct:jroig@finger.farm` and return some data. 
