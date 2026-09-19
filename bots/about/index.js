const fs = require('fs');
const path = require('path');

const planText = fs.readFileSync(path.join(__dirname, 'about.txt'), 'utf8');

module.exports = {
    name: 'about',
    displayname: 'FingerFarm',
    handleRequest: async (context) => {
        return {
            username: 'about',
            displayname: 'FingerFarm',
            lastupdate: new Date().toISOString(),
            plan: planText
        };
    }
};
