const fs = require('fs');
const path = require('path');

const planText = fs.readFileSync(path.join(__dirname, 'about.txt'), 'utf8');

module.exports = {
    name: 'about',
    handleRequest: async (context) => {
        return {
            username: 'about',
            displayname: 'Abouty McAboutface',
            lastupdate: new Date().toISOString(),
            plan: planText
        };
    }
};
