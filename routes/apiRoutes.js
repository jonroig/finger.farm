const fs = require('fs');
const express = require('express');
const cors = require('cors');
const router = express.Router();

const config = require('../config').config;
const connection = require('../connection');
const fingerWelcome = fs.readFileSync('./views/finger/welcome.txt', 'utf8');


// api get endpoint for JSON... the rough equivalent of running finger somebody@finger.farm

router.get('/api/:username', cors(), (req, res) => {
    const username = req.params.username || '';
    const cleanUsername = username.toLowerCase().trim();
    connection.all('SELECT * FROM users WHERE username = ?', [cleanUsername], (error, data) => {
        if (error) {
            return res.status(500).json({
                message: 'Internal Error',
                statusCode: 500
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: 'Not found',
                statusCode: 404
            });
        }

        const user = data[0];
        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        return res.status(200).json(user);
    });
});

router.get('/api/:username/html', cors(), (req, res) => {
    const username = req.params.username || '';
    const cleanUsername = username.toLowerCase().trim();
    connection.all('SELECT * FROM users WHERE username = ?', [cleanUsername], (error, data) => {
        if (error) {
            return res.status(500).json({
                message: 'Internal Error',
                statusCode: 500
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                message: 'Not found',
                statusCode: 404
            });
        }

        const user = data[0];
        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        
        return res.render('html', {
            ...user,
            fingerWelcome,
            config,
            layout: false
        });
    });
});

router.options('/api/:username/project', cors()) 
router.put('/api/:username/project', cors(), (req, res) => {
    const username = req.params.username || '';
    const cleanUsername = username.toLowerCase().trim();

    connection.all('SELECT * FROM users WHERE username = ? AND token = ?', [cleanUsername, req.body.token], (error, users) => {
        if (users.length === 0) {
            const message = "Invalid user / token";
            return res.status(404).json({ status: 404, message });
        }

        connection.run(`UPDATE users SET project = ?, lastupdate=datetime('now') WHERE username = ? AND token = ?`, [req.body.data, cleanUsername, req.body.token], (error, users) => {
           
            connection.all('SELECT * FROM users WHERE username = ?', [cleanUsername], (error, data) => {
                const user = data[0];
                delete user.id;
                delete user.passwordcrypt;
                delete user.token;
                delete user.ext_id;
                delete user.authsource;
                
                return res.status(200).json( {status: 200, user} );
            });
        }); 
    });
});

router.options('/api/:username/plan', cors()) 
router.put('/api/:username/plan', cors(), (req, res) => {
    const username = req.params.username || '';
    const cleanUsername = username.toLowerCase().trim();

    connection.all('SELECT * FROM users WHERE username = ? AND token = ?', [cleanUsername, req.body.token], (error, users) => {
        if (users.length === 0) {
            const message = "Invalid user / token";
            return res.status(404).json({ status: 404, message });
        }

        connection.run(`UPDATE users SET plan = ?, lastupdate=datetime('now') WHERE username = ? AND token = ?`, [req.body.data, cleanUsername, req.body.token], (error, users) => {
            connection.all('SELECT * FROM users WHERE username = ?', [cleanUsername], (error, data) => {
                const user = data[0];
                delete user.id;
                delete user.passwordcrypt;
                delete user.token;
                delete user.ext_id;
                delete user.authsource;
                
                return res.status(200).json( {status: 200, user} );
            });
        }); 
    });
});


module.exports = router;
