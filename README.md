# Finger.Farm Modern Finger Hosting
https://finger.farm

Originally conceived as a way to get a status report on someone or something, the Finger Protocol aka RFC-742, has been around since the late 70s. Even today, the capability to finger lies dormant in every major OS.

Once upon a time, you could finger your boss, finger a vending machine, finger the weather, finger John Carmack, etc... Users would share .project and .plan files, showing their current project and plans. The original telepresence. The original Internet of Things. The original microblogging.

Although it's fallen out of fashion, finger still works and still has a valid purpose. Finger.Farm breathes new life into an ancient protocol, bringing the advanced finger features and finger functions into the future.

## Usage
**From the internet:**
* Open your Mac / Windows / Linux terminal
* Type: `finger jroig@finger.farm`
* Profit

**Local CLI Testing:**
Finger.Farm includes a built-in CLI tool to quickly test your local database and bot configurations without booting the entire server:
```bash
# Query a specific user or bot
node fingerfarm.js quotes@finger.farm

# View the directory of public users
node fingerfarm.js ""
```

## Features
* Node.js implementation of a Finger server
* CORS / REST API endpoints
* UPDATE via API
* Pluggable Database Backend (Default: SQLite)
* Dynamic Authentication via [Passport.js](https://www.passportjs.org/) (GitHub, Google, Discord)

## Configuration
Finger.Farm uses `dotenv` for configuration. Copy `.env.example` to `.env` and fill in your values. 

```bash
cp .env.example .env
```

### Bot Plugins
Finger.Farm supports a folder-based plugin system for bots! You can write simple Javascript modules to dynamically respond to finger requests and HTTP JSON requests.

To add a bot:
1. Create a new folder inside `bots/` named after your bot (e.g. `bots/echo/`).
2. Create an `index.js` file inside that folder.
3. Export a standard interface with a `name` and an async `handleRequest` function that returns a JSON object.
4. Restart the server.

Example `bots/echo/index.js`:
```javascript
module.exports = {
    name: 'echo',
    handleRequest: async (context) => {
        // context contains { username, ip, db, config }
        return {
            username: 'echo',
            displayname: 'Echo Bot',
            lastupdate: new Date().toISOString(),
            plan: `Hello! You fingered "${context.username}" from ${context.ip}\r\n`
        };
    }
}
```
Now, anyone running `finger echo@finger.farm` will receive your dynamic response!

### Authentication Providers
Authentication is completely dynamic, powered by [Passport.js](https://www.passportjs.org/)! Out of the box, `finger.farm` supports GitHub, Google, and Discord. The app reads your `.env` file and automatically enables login for any provider that has API credentials configured.

**To add a new provider (e.g. Facebook):**
1. Run `npm install passport-facebook` (see [Passport.js strategies](https://www.passportjs.org/packages/) for more).
2. Add your Facebook credentials to `.env`.
3. Open `config.js` and add `facebook` to the `passportStrategies` object, defining the `Strategy`, `config`, `icon`, and `name`. 
That's it! The backend will automatically generate the routes and the frontend will automatically render the login button.

### Database Adapters
Finger.Farm is completely decoupled from any specific database using the **Repository Pattern**. It ships with the following adapters out of the box:
- **SQLite** (Default)
- **PostgreSQL**
- **MySQL / MariaDB**
- **MongoDB**
- **Supabase**
- **Redis**
- **Firebase**

To switch to a different database:
1. Change `DB_TYPE` in your `.env` file (e.g. `DB_TYPE=postgres`).
2. Fill in the corresponding connection string in your `.env` file.
3. Restart the server!

**Writing a Custom Adapter (e.g., Postgres, MongoDB):**
To add a new database:
1. Create a new file in `lib/db/` (e.g., `postgresAdapter.js`).
2. Implement all the required methods found in `lib/db/sqliteAdapter.js` (e.g., `getUserByUsername`, `createUser`, `updateProfile`).
3. Open `connection.js` and add a new `else if (process.env.DB_TYPE === 'postgres')` block to load your adapter.

## Startup
```bash
npm install
node index.js
```

... or, even better: `pm2 start index.js` (if you're into that kinda thing)

You will almost certainly want to run this behind a reverse proxy like HAProxy or Nginx.
