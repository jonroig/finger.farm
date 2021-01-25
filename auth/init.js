var passport = require('passport');
const connection = require('../connection');


module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.all('SELECT * FROM users WHERE id = ?', [id], (err, users) => {
        if (err) {
            return done(err, null);
        }
        const user = users[0];
        return done(null, user);
    });
});


};