const fs = require('fs');
const path = require('path');

const planText = fs.readFileSync(path.join(__dirname, 'finger.txt'), 'utf8');

module.exports = {
    name: 'finger',
    displayname: 'The Finger',
    handleRequest: async (context) => {
        return {
            username: 'finger',
            displayname: 'The Finger',
            lastupdate: new Date().toISOString(),
            plan: planText
        };
    }
};
