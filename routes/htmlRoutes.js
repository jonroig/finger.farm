const path = require('path');
const express = require('express');
const router = express.Router();

const db = require('../connection');
const config = require('../config').config;
const strategies = require('../auth/strategies');
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
router.get('/', checkAuthentication, async function (req, res) {
    try {
        const users = await db.getRecentUsers(10);
        
        // Pass active providers to the frontend
        const activeProviders = Object.keys(strategies)
            .map(key => ({ id: key, ...strategies[key] }))
            .filter(provider => provider.enabled);

        res.render('home', {
            users,
            activeProviders,
            config
        });
    } catch (error) {
        res.status(500).send('Internal Error');
    }
});


// status
router.get('/status', async (req, res) => {
    try {
        const count = await db.getUserCount();
        return res.render('status', 
        {
            isLoggedIn: req.isAuthenticated(),
            config,
            pageTitle: 'Status',
            currentUsers: count
        });
    } catch (error) {
        res.status(500).send('Internal Error');
    }
});


// general profile rendering
router.get('/profile', checkAuthentication, async (req, res) => {
    try {
        const user = await db.getUserById(req.user.id);
        console.log({user});
        return res.render('profile', 
        {
            isLoggedIn: true,
            hasUsername: !!user.username,
            ...user,
            config,
            pageTitle: user.username || 'Profile'
        });
    } catch (error) {
        res.status(500).send('Internal Error');
    }
});


// username changes
router.put('/profile/username', checkAuthentication, async (req, res) => {
    try {
        const cleanUsername = req.body.username.toLowerCase().trim();
        // valid chars only

        const botManager = require('../lib/botManager');
        if (botManager.getBot(cleanUsername)) {
            const message = `${cleanUsername} is a reserved system bot`;
            return res.status(400).send({error: true,  message });
        }

        if (cleanUsername.replace(/\W+/g, "") !== cleanUsername) {
            const message = 'Username can only contain alphanumeric characters or underscores';
            return res.status(400).send({ error: true, message });
        }

        if (cleanUsername.length > 255 || cleanUsername.length === 0) {
            const message = 'Usernames must be 1-255 characters';
            return res.status(400).send({error: true,  message });
        }

        const existingUser = await db.getUserByUsername(cleanUsername);

        if (existingUser) {
            const message = 'Username already taken';
            return res.status(400).send({error: true,  message });
        }

        await db.updateUsername(req.user.id, cleanUsername);
        return res.status(200).send({ ok: true });
    } catch (err) {
        console.log('err', err);
        return res.status(400).send({error: true,  err });
    }
});


// regenerate token
router.put('/profile/token', checkAuthentication, async (req, res) => {
    try {
        await db.updateToken(req.user.id, nanoid(48));
        return res.status(200).send({ ok: true });
    } catch (err) {
        console.log('err', err);
        return res.status(400).send({error: true,  err });
    }
});


// general profile update
router.put('/profile', checkAuthentication, async (req, res) => {
    try {
        const displayname = req.body.displayname.trim();
        const plan = req.body.plan.trim();
        const project = req.body.project.trim();

        if (displayname.length > 255) {
            const message = 'Display names cannot be more than 255 characters';
            return res.status(400).send({error: true,  message });
        }

        await db.updateProfile(req.user.id, displayname, plan, project);
        return res.status(200).send({ ok: true });
    } catch (err) {
        console.log('err', err);
        return res.status(400).send({error: true,  err });
    }
});

module.exports = router;