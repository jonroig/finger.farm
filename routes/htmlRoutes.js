const path = require('path');
const express = require('express');
const router = express.Router();

const connection = require('../connection');
const passportGithub = require('../auth/github');
const passportTwitter = require('../auth/twitter');
const config = require('../config').config;
const { nanoid } =  require('nanoid');

function checkAuthentication(req, res, next) {
    const isAuthenticate = req.isAuthenticated();
    if (isAuthenticate) {
        if (req.url === '/') {
            return res.redirect('/profile');
        }
        return next();
    }

    if (!isAuthenticate && req.url === '/') {
        return next();
    }

    return res.redirect('/');
}

// Basic route
router.get('/', checkAuthentication, function (req, res) {
    res.render('home', {
        config
    });
});


// github auth stuff
router.get('/auth/github', passportGithub.authenticate('github', { scope: [ '' ] }));
router.get('/auth/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication
        return res.redirect('/profile');
    }
);

// twitter auth stuff
router.get('/auth/twitter', passportTwitter.authenticate('twitter', { scope: [ '' ] }));
router.get('/auth/twitter/callback',
passportTwitter.authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication
        return res.redirect('/profile');
    }
);


// status
router.get('/status', (req, res) => {
    return connection.all('SELECT COUNT(id) FROM users', [], (error, data) => {
        return res.render('status', 
        {
            isLoggedIn: req.isAuthenticated(),
            config,
            pageTitle: 'Status',
            currentUsers: data[0]['COUNT(id)']
        });
    });
});


// general profile rendering
router.get('/profile', checkAuthentication, (req, res) => {
    return connection.all('SELECT * FROM users WHERE id = ?', [req.user.id], (error, data) => {
        const user = data[0];
        console.log({user});
        return res.render('profile', 
        {
            isLoggedIn: true,
            hasUsername: !!user.username,
            ...user,
            config,
            pageTitle: user.username || 'Profile'
        });
    });
});


// username changes
router.put('/profile/username', checkAuthentication,  (req, res) => {
    const cleanUsername = req.body.username.toLowerCase().trim();
    // valid chars only

    if (config.defaultUsers[cleanUsername]) {
        const message = `${cleanUsername} is a reserved username`;
        return res.status(400).send({error: true,  message });
    }

    if (cleanUsername.replace(/[\W_]+/g,"") !== cleanUsername) {
        const message = 'Username can only contain alphanumeric characters or underscores';
        return res.status(400).send({ error: true, message });
    }

    if (cleanUsername.length > 255 || cleanUsername.length === 0) {
        const message = 'Usernames must be 1-255 characters';
        return res.status(400).send({error: true,  message });
    }

    connection.all('SELECT * FROM users WHERE username = ?', [cleanUsername], (err, data) => {
        if (err) {
            console.log('err', err);
            return res.status(400).send({error: true,  err });
        }

        if (data.length > 0) {
            const message = 'Username already taken';
            return res.status(400).send({error: true,  message });
        }

        connection.run(`UPDATE users SET username = ?, lastupdate=datetime('now') WHERE id = ?`, [cleanUsername, req.user.id], function (err) {
            if (err) {
                console.log('err', err);
                return res.status(400).send({error: true,  err });
            }
    
            return res.status(200).send({ ok: true });
        });
    });

    
});


// regenerate token
router.put('/profile/token', checkAuthentication,  (req, res) => {
    return connection.run(`
            UPDATE users 
            SET token = ?
            WHERE id = ?
        `, [nanoid(48), req.user.id], function (err) {
        if (err) {
            console.log('err', err);
            return res.status(400).send({error: true,  err });
        }

        return res.status(200).send({ ok: true });
    });
});


// general profile update
router.put('/profile', checkAuthentication,  (req, res) => {
    const displayname = req.body.displayname.trim();
    const plan = req.body.plan.trim();
    const project = req.body.project.trim();

    if (displayname.length > 255) {
        const message = 'Display names cannot be more than 255 characters';
        return res.status(400).send({error: true,  message });
    }

    return connection.run(`
            UPDATE users 
            SET displayname = ?,
            plan = ?,
            project = ?,
            lastupdate=datetime('now')
            WHERE id = ?
        `, [displayname, plan, project, req.user.id], function (err) {
        if (err) {
            console.log('err', err);
            return res.status(400).send({error: true,  err });
        }

        return res.status(200).send({ ok: true });
    });
});

module.exports = router;