const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = config.connect.import('../models/IssueTracker_Users');
const Users = require('../models/users');
const UserRoles = require('../models/user-roles');

module.exports = function(passport) {
  router.get('/failure', function(req, res){
    res.send({state: 'failure', user: null, message: "Invaild username or password"});
  });

  // Authenticate
  router.post('/login', (req, res, next) => {
    //capture the username and password from the req
    const username = req.body.username;
    const password = req.body.password;

    //use the predefined db quesry (from ../models/users.js) to grab a user object
    //and authenticate the user
    Users.getUserByUsername(username, (err, user) => {
      //if there is an error, throw it
      if(err) throw err;
      //if the user cannot be found, send a false to the authController
      if(!user){
        return res.status(401).json({success: false, msg: 'User not found'});
      }
      //if there is a user, compare the password hashes
      Users.comparePassword(password, user.UserPassword, (err, isMatch) => {
        if(err) throw err;
        //if the passwords match, generate a token, and send it to the
        //authcontroller with success
        if(isMatch){
          console.log('password matched');
          const token = generateJWT(user);

          res.json({
            success: true,
            token: 'JWT '+token,
            user: {
              id: user.UserId,
              displayname: user.DisplayName,
              username: user.UserName,
              email: user.Email
            }
          });
        } else {
          console.log('password does not match');
          return res.json({success: false, message: 'Wrong password'});
        }
      });
    });
  });

  router.get('/projects', passport.authenticate('jwt', {
    session: false, }), function(req, res) {
    console.log("here");
    res.send(req.user);
    //res.render('projects', { title: 'Projects' });
  });

  //function which generates JWT
  var generateJWT = function(user) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    var uRoles = [1, 2, 3];
    //the token needs to have the user's roles in it
    uRoles = UserRoles.getRolesById(user.UserId, (err, roles) => {
      if (err)
        throw err;
      if(!roles) {
        return [];
      }
      else {
        console.log(roles);
        return roles;
      }
    });
    console.log('roles: ', uRoles);
    return jwt.sign({
      id: user.UserId,
      username: user.UserName,
      roles: uRoles,
      exp: parseInt(expiry.getTime() / 1000),
    }, config.secret);
  };
  return router;
};
