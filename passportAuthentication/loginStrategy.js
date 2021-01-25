const Strategy = require('passport-local');
const bcrypt = require('bcryptjs');

const connection = require('../connection');


const loginStrategy = new Strategy({ usernameField: 'username' }, (username, password, cb) => {
    // Search user by email in DB
    const cleanUsername = username.toLowerCase().trim();
    const cleanPassword = password.trim();

    connection.all('SELECT * FROM users WHERE username = ? ', [cleanUsername], (err, users) => {
        if (err) {
            console.log(err);
            return cb({ message: 'Internal Server error', statusCode: 500 }, null);
        }
        const user = users[0];
        if (!user) {
            return cb({ message: 'Email or Password is incorrect', statusCode: 400 }, null);
        }

        const userPassword = users[0].passwordcrypt;
        const isPasswordValid = bcrypt.compareSync(password, userPassword);

        // Validate user password
        if (!isPasswordValid) {
            return cb({ message: 'Email or Password is incorrect', statusCode: 400 }, null);
        }
        const currentUser = users[0];
        cb(null, currentUser);
    });
});

module.exports = loginStrategy;