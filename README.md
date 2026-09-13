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
* Node.js implementation of a Finger server
* CORS / REST API endpoints
* UPDATE via API
* Pluggable Database Backend (Default: SQLite)
* Dynamic Authentication via Passport (GitHub, Google, Discord)

## Configuration
Finger.Farm uses `dotenv` for configuration. Copy `.env.example` to `.env` and fill in your values. 

```bash
cp .env.example .env
```

### Authentication Providers
Authentication is completely dynamic! Out of the box, `finger.farm` supports GitHub, Google, and Discord. The app reads your `.env` file and automatically enables login for any provider that has API credentials configured.

**To add a new provider (e.g. Facebook):**
1. Run `npm install passport-facebook`.
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
