// Finger server reference code by Matt Croydon / http://postneo.com
// https://gist.github.com/mcroydon/519344/09979e74352594f670477efda7f0306519e6cd1b

const net = require('net');
const fs = require('fs');
const config = require('../config').config;
const db = require('../connection');
const core = require('./core');

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
    
    socket.on("data", async (username) => {
        logFingerEvent(`Requested: ${username.trim()}`, socket);
        const response = await core.getFingerResponse(username, socket.remoteAddress);
        socket.write(response);
        socket.end();
    });
    socket.on("end", () => {
        logFingerEvent('Connection end', socket);
        socket.end();
    });
}).listen(config.fingerServer.port);


fingerServer.on('error', (err) => { console.log('Finger server error', err)});
fingerServer.on('listening', () => { logFingerMessage(`server listening on port ${config.fingerServer.port}`) });
