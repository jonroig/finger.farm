const fs = require('fs');
const express = require('express');
const cors = require('cors');
const router = express.Router();

const config = require('../config').config;
const db = require('../connection');
const fingerWelcome = fs.readFileSync('./views/finger/welcome.txt', 'utf8');


// api get endpoint for JSON... the rough equivalent of running finger somebody@finger.farm

router.get('/api/:username', cors(), async (req, res) => {
    try {
        const username = req.params.username || '';
        const cleanUsername = username.toLowerCase().trim();
        const user = await db.getUserByUsername(cleanUsername);
        
        if (!user) {
            return res.status(404).json({
                message: 'Not found',
                statusCode: 404
            });
        }

        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Error',
            statusCode: 500
        });
    }
});

router.get('/api/:username/html', cors(), async (req, res) => {
    try {
        const username = req.params.username || '';
        const cleanUsername = username.toLowerCase().trim();
        const user = await db.getUserByUsername(cleanUsername);
        
        if (!user) {
            return res.status(404).json({
                message: 'Not found',
                statusCode: 404
            });
        }

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
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Error',
            statusCode: 500
        });
    }
});

router.options('/api/:username/project', cors());
router.put('/api/:username/project', cors(), async (req, res) => {
    try {
        const username = req.params.username || '';
        const cleanUsername = username.toLowerCase().trim();

        const validUser = await db.getUserByToken(cleanUsername, req.body.token);
        if (!validUser) {
            const message = "Invalid user / token";
            return res.status(404).json({ status: 404, message });
        }

        await db.updateProjectByToken(cleanUsername, req.body.token, req.body.data);
        
        const user = await db.getUserByUsername(cleanUsername);
        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        
        return res.status(200).json( {status: 200, user} );
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal error' });
    }
});

router.options('/api/:username/plan', cors());
router.put('/api/:username/plan', cors(), async (req, res) => {
    try {
        const username = req.params.username || '';
        const cleanUsername = username.toLowerCase().trim();

        const validUser = await db.getUserByToken(cleanUsername, req.body.token);
        if (!validUser) {
            const message = "Invalid user / token";
            return res.status(404).json({ status: 404, message });
        }

        await db.updatePlanByToken(cleanUsername, req.body.token, req.body.data);
        
        const user = await db.getUserByUsername(cleanUsername);
        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        
        return res.status(200).json( {status: 200, user} );
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal error' });
    }
});

module.exports = router;
