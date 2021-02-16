// Finger server reference code by Matt Croydon / http://postneo.com
// https://gist.github.com/mcroydon/519344/09979e74352594f670477efda7f0306519e6cd1b

const net = require('net');
const fs = require('fs');
const config = require('../config').config;
const connection = require('../connection');

// some default messages
const fingerWelcome = fs.readFileSync('./views/finger/welcome.txt', 'utf8');

// Padding for user lists.
const pad = (string, length) => {
    length = length || 20;
    while (string.length <= length) {
        string = string + ' ';
    }
    return string
};

// Input cleaning
var cleanUsername = (string) => {
    return string
        .replace('/W', '')
        .replace('\r\n', '')
        .toLowerCase();
};

// basic event logging
const logFingerEvent = (eventTxt, socket) => {
    const now = new Date();
    console.log(`${now.toISOString()} Finger ${socket.remoteAddress} ${eventTxt}`);
}
const logFingerMessage = (messageTxt) => {
    const now = new Date();
    console.log(`${now.toISOString()} Finger ${messageTxt}`);
}

// the main server
const fingerServer = net.createServer((socket) => {
    socket.setEncoding("ascii");
    
    socket.on("data", (username) => {
        logFingerEvent('Connection begin', socket);
        socket.write(fingerWelcome);
    
        // main index page
        const cleanName = cleanUsername(username);
        if (cleanName === '') {
            logFingerEvent('Serving findex', socket);
            
            socket.write('Directory of public users: \r\n\r\n');

            socket.write(`${pad('Login')}${pad('Name')}\r\n`);
            socket.write(`${pad('-----')}${pad('----')}\r\n`);
            for (const index in config.defaultUsers) {
                var user = config.defaultUsers[index];
                socket.write(pad(index) + pad(user.name) + '\r\n');
            }
            socket.write('\r\r\r\n');
            return socket.end();
        } 

        // check for the other default users
        if (config.defaultUsers[cleanName]) {
            socket.write(`Login: ${cleanName}\r\n\r\n${config.defaultUsers[cleanName].plan}\r\n\n`);
            return socket.end();
        }

        
        connection.all('SELECT * FROM users WHERE username = ? ', [cleanName], (err, users) => {
            if (err) {
                console.log('err', err);
                socket.write(`Error: \r\n${err}\r\n\r\n`);
            } else {
                const user = users[0];
                // Check if the user exists
                if (!user) {
                    socket.write(`User: ${cleanName} not found\r\n\r\n`);
                    logFingerEvent(`Unhandled ${cleanName}`, socket);
                } else {
                    socket.write(pad('Login: ' + user.username, 40) + pad('Name: ' + user.displayname, 40) + '\r\n\r\n');
                    socket.write(`Updated:\r\n${user.lastupdate}\r\n\r\n`);
                    if (user.project) {
                        socket.write(`Project:\r\n${user.project}\r\n\r\n`);
                    }
                    if (user.plan) {
                        socket.write(`Plan:\r\n${user.plan}\r\n\r\n`);
                    }
                }
            }

            socket.end();
        });
    });
    socket.on("end", () => {
        logFingerEvent('Connection end', socket);
        socket.end();
    });
}).listen(config.fingerServer.port);


fingerServer.on('error', (err) => { console.log('Finger server error', err)});
fingerServer.on('listening', () => { logFingerMessage(`server listening on port ${config.fingerServer.port}`) });
  
  
