# Finger.Farm Modern Finger Hosting
https://finger.farm

Originally conceived as a way to get a status report on someone or something, the Finger Protocol aka RFC-742, has been around since the late 70s. Even today, the capability to finger lies dormant in every major OS.

Once upon a time, you could finger your boss, finger a vending machine, finger the weather, finger John Carmack, etc... Users would share .project and .plan files, showing their current project and plans. The original telepresence. The original Internet of Things. The original microblogging.

Although it's fallen out of fashion, finger still works and still has a valid purpose. Finger.Farm breathes new life into an ancient protocol, bringing the advanced finger features and finger functions into the future.

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

## Startup
```bash
npm install
node index.js
```

... or, even better: `pm2 start index.js` (if you're into that kinda thing)

You will almost certainly want to run this behind a reverse proxy like HAProxy or Nginx.

## Local CLI Testing
Finger.Farm includes a built-in CLI tool to quickly test your local database and bot configurations without booting the entire server:
```bash
# Query a specific user or bot
node fingerfarm.js quotes@finger.farm

# View the directory of public users
node fingerfarm.js ""
```

## Configuration
Finger.Farm uses `dotenv` for configuration. Copy `.env.example` to `.env` and fill in your values. 

```bash
cp .env.example .env
```

### Bot Plugins
Finger.Farm supports a folder-based plugin system for bots! You can write simple Javascript modules to dynamically respond to finger requests / HTTP JSON requests.

**[➡️ Bot interface specifications / examples](bots/README.md)**

### Authentication Providers
Authentication is completely dynamic, powered by [Passport.js](https://www.passportjs.org/)! Out of the box, `finger.farm` comes pre-wired with support for **14 of the most popular OAuth2 providers** (including GitHub, Google, Discord, Reddit, Slack, and more). The app reads your `.env` file and automatically enables login / API auth for any provider that has API credentials configured. You can add your own as well.

**[➡️ Supported authentication providers / instructions](auth/README.md)**

### Database Adapters
Finger.Farm is completely decoupled from any specific database using the **Repository Pattern**. It ships with support for **SQLite, PostgreSQL, MySQL, MongoDB, Supabase, Redis, and Firebase**. We welcome contributions of other database adapters.

To switch to a different database:
1. Change `DB_TYPE` in your `.env` file (e.g. `DB_TYPE=postgres`).
2. Fill in the corresponding connection string in your `.env` file.
3. Restart the server!

**[➡️ Supported databases / custom adapters](lib/db/README.md)**


