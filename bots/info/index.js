const fs = require('fs');
const path = require('path');

const planText = fs.readFileSync(path.join(__dirname, 'info.txt'), 'utf8');

module.exports = {
    name: 'info',
    displayname: 'Gary the Marauder',
    handleRequest: async (context) => {
        return {
            username: 'info',
            displayname: 'Gary the Marauder',
            lastupdate: new Date().toISOString(),
            plan: planText
        };
    }
};
