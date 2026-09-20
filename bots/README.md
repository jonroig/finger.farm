# Finger.Farm Bot Plugins

The `bots/` directory is where you can drop simple Javascript modules to dynamically intercept and respond to Finger protocol requests on Finger.Farm.

## How it works

When the Finger server receives a request (e.g. `finger mybot@finger.farm`), it checks this folder before hitting the database. If a `.js` file exports a `name` matching the requested username (e.g., `mybot`), the server hands the request over to that file's `handleRequest()` function.

## Creating a Bot

To create a new bot, add a new folder to this directory named after your bot. Inside that folder, create an `index.js` file. The module must export a specific interface.

### The Bot Interface

Example `bots/mybot/index.js`:
```javascript
module.exports = {
    // The username that triggers this bot (must be lowercase)
    name: 'mybot', 
    
    // The human-readable name shown in the public directory
    displayname: 'My Awesome Bot',
    
    // The async function called when this bot is triggered
    handleRequest: async (context) => {
        // Return a standard JSON object. Finger.Farm will automatically 
        // format this object into ASCII text for terminal users, and 
        // JSON/HTML for web API users!
        return {
            username: 'mybot',
            displayname: 'My Bot',
            project: 'Optional project string',
            plan: 'Hello World! This is the main content.',
            lastupdate: new Date().toISOString()
        };
    }
};
```

### The `context` Object

When `handleRequest(context)` is called, Finger.Farm injects a rich `context` object containing information about the request and the server environment.

- `context.username`: (String) Requested username (always matches your bot's `name`).
- `context.ip`: (String) Remote IP address of the user who executed the finger command.
- `context.config`: (Object) Global configuration object for Finger.Farm (contains base URLs, ports, etc.).
- `context.db`: (Object) Active Database Adapter instance. This allows your bot to make queries against the `users` table using standard methods like `await context.db.getUserCount()`.

## HTTP and TCP Support

Bots return structured JSON objects, they function just like standard users! 
- If a user runs `finger mybot@finger.farm`, the server formats your JSON object into classic ASCII text.
- If a user hits `https://finger.farm/api/mybot`, the server returns your JSON object natively!

## Examples

Check out the included bots for inspiration:
- `quotes.js`: A simple bot that randomly selects a string from an array.
- `echo.js`: A bot that demonstrates how to read from the `context` object by echoing back the user's IP address.
