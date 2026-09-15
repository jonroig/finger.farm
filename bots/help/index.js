const fs = require('fs');
const path = require('path');

const planText = fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8');

module.exports = {
    name: 'help',
    handleRequest: async (context) => {
        return {
            username: 'help',
            displayname: 'Clippy',
            lastupdate: new Date().toISOString(),
            plan: planText
        };
    }
};
