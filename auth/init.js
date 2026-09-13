var passport = require('passport');
const db = require('../connection');


module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
        const user = await db.getUserById(id);
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
  });


};