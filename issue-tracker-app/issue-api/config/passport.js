const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
//const passport = require('passport');
const User = require('../models/users');
const config = require('./database');


module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromHeader("Authorization");
  opts.secretOrKey = config.secret;

  //define the strategy
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('inside the strategy: ', jwt_payload);
    User.getUserById(jwt_payload._doc._id, (err, user) => {
      if(err){
        console.log('error');
        return done(err, false);
      }

      if(user){
        console.log('match');
        return done(null, user);
      } else {
        console.log('no match');
        return done(null, false);
      }
    });
  }));
}
