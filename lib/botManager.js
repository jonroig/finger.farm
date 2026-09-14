const fs = require('fs');
const path = require('path');

class BotManager {
    constructor() {
        this.bots = new Map();
        this.loadBots();
    }

    loadBots() {
        const botsDir = path.join(__dirname, '../bots');
        
        // Ensure directory exists
        if (!fs.existsSync(botsDir)) {
            fs.mkdirSync(botsDir);
        }

        const files = fs.readdirSync(botsDir, { withFileTypes: true });
        
        for (const dirent of files) {
            if (dirent.isDirectory()) {
                try {
                    const botPath = path.join(botsDir, dirent.name);
                    const indexPath = path.join(botPath, 'index.js');
                    
                    if (fs.existsSync(indexPath)) {
                        // Clear require cache in case of hot reloading in the future
                        delete require.cache[require.resolve(botPath)];
                        
                        const bot = require(botPath);
                    
                    // Validate standard interface
                    if (bot && typeof bot.name === 'string' && typeof bot.handleRequest === 'function') {
                        const cleanName = bot.name.toLowerCase().trim();
                        this.bots.set(cleanName, bot);
                        if (!process.env.CLI_MODE) {
                            console.log(`[BotManager] Loaded bot: ${cleanName}`);
                        }
                    } else {
                        console.warn(`[BotManager] Invalid bot interface in ${dirent.name}/index.js. Must export 'name' and 'handleRequest'.`);
                    }
                    }
                } catch (err) {
                    console.error(`[BotManager] Error loading bot ${dirent.name}:`, err);
                }
            }
        }
    }

    getBot(username) {
        return this.bots.get(username.toLowerCase().trim());
    }

    async handle(bot, context) {
        try {
            // Context includes things like { username, ip, db, config }
            return await bot.handleRequest(context);
        } catch (err) {
            console.error(`[BotManager] Error executing bot ${bot.name}:`, err);
            return `Error executing bot ${bot.name}`;
        }
    }
}

module.exports = new BotManager();
