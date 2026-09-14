#!/usr/bin/env node

require('dotenv').config();
process.env.CLI_MODE = 'true';
const core = require('./lib/core');

async function main() {
    const rawUsername = process.argv[2] || '';
    
    try {
        const response = await core.getFingerResponse(rawUsername, '127.0.0.1');
        process.stdout.write(response);
    } catch (err) {
        console.error('Failed to execute local finger:', err);
    } finally {
        process.exit(0);
    }
}

main();
