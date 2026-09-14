const fs = require('fs');
const path = require('path');
const config = require('../config').config;
const db = require('../connection');
const botManager = require('./botManager');

const fingerWelcome = fs.readFileSync(path.join(__dirname, '../views/finger/welcome.txt'), 'utf8');

const pad = (string, length) => {
    length = length || 20;
    while (string.length <= length) {
        string = string + ' ';
    }
    return string
};

const cleanUsername = (string) => {
    return string
        .replace('/W', '')
        .replace('\r\n', '')
        .trim()
        .toLowerCase();
};

async function getFingerResponse(rawUsername, ipAddress = '127.0.0.1') {
    let output = fingerWelcome;
    
    // Support testing `node fingerfarm.js username@finger.farm` by stripping domain
    const parts = rawUsername.split('@');
    const targetUsername = parts[0];
    
    const cleanName = cleanUsername(targetUsername);
    
    if (cleanName === '') {
        output += 'Directory of public users: \r\n\r\n';
        output += `${pad('Login')}${pad('Name')}\r\n`;
        output += `${pad('-----')}${pad('----')}\r\n`;
        
        for (const [name, bot] of botManager.bots.entries()) {
            output += pad(name) + pad('Bot') + '\r\n';
        }

        if (config.showPublicUsers) {
            try {
                // Fetch recent users (limit to 50 for sanity)
                const recentUsers = await db.getRecentUsers(50);
                for (const user of recentUsers) {
                    if (user.username) {
                        output += pad(user.username) + pad(user.displayname || '') + '\r\n';
                    }
                }
            } catch (err) {
                console.error('Failed to load public users for directory:', err);
            }
        }

        output += '\r\r\r\n';
        return output;
    }

    const bot = botManager.getBot(cleanName);
    let user;

    if (bot) {
        const context = {
            username: cleanName,
            ip: ipAddress,
            config,
            db
        };
        user = await botManager.handle(bot, context);
    }

    try {
        if (!user) {
            user = await db.getUserByUsername(cleanName);
        }
        if (!user) {
            output += `User: ${cleanName} not found\r\n\r\n`;
        } else {
            output += pad('Login: ' + user.username, 40) + pad('Name: ' + user.displayname, 40) + '\r\n\r\n';
            output += `Updated:\r\n${user.lastupdate}\r\n\r\n`;
            if (user.project) {
                output += `Project:\r\n${user.project}\r\n\r\n`;
            }
            if (user.plan) {
                output += `Plan:\r\n${user.plan}\r\n\r\n`;
            }
        }
        return output;
    } catch (err) {
        console.error('Error generating finger response:', err);
        output += `Error: \r\n${err}\r\n\r\n`;
        return output;
    }
}

module.exports = { getFingerResponse, cleanUsername };
