const Strategy = require('passport-local');
const { nanoid } =  require('nanoid');
const bcrypt = require('bcryptjs');

const connection = require('../connection');

const localStrategy = new Strategy({ passReqToCallback: true }, (req, username, password, cb) => {
    let message = 'Internal server error';

    // clean and check the input
    const cleanUsername = req.body.username.toLowerCase().trim();
    const cleanPassword = req.body.password.trim();
    if (cleanUsername.length > 255 || cleanUsername.length === 0) {
        message = 'Usernames must be 1-255 characters';
    }
    if (cleanPassword.length > 255 || cleanPassword.length === 0) {
        message = 'Passwords must be between 1-255 characters';
    }

    // valid chars only
    if (cleanUsername.replace(/[\W_]+/g,"") !== cleanUsername) {
        message = 'Username can only contain alphanumeric characters or underscores';
        return cb({ message, statusCode: 400 }, null);
    }

    // Search user by email in DB
    connection.all('SELECT * FROM users WHERE username = ? ', [cleanUsername], (err, users) => {
        if (err) {
            console.log('err', err);
            return cb({ message, statusCode: 500 }, null);
        }

        const user = users[0];
        // Check if the user exists
        if (user) {
            message = 'Username already exists';
            return cb({ message, statusCode: 400 }, null);
        }
        
        // create the token and the password crypt
        const salt = bcrypt.genSaltSync(10);
        let newUser = {
            userName: cleanUsername,
            passwordCrypt: bcrypt.hashSync(cleanPassword, salt),
            token: nanoid(48)
        };

        // create the new user
        connection.run(`
            INSERT INTO users 
            (username, displayname, passwordcrypt, plan, project, token) 
            VALUES 
            (?, ?, ?, '', '', ?)`
            , [newUser.userName, newUser.userName, newUser.passwordCrypt, newUser.token], function (err) {
            if (err) {
                console.log('err: ', err);
                return cb({ message: 'Internal server error', statusCode: 500 }, null)
            }
          
            newUser.id = this.lastID;
            return cb(null, newUser);
        });
    });
});

module.exports = localStrategy;