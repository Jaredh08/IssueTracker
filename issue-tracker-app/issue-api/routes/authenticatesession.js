var express = require('express');
var router = express.Router();

module.exports = function(passport) {

  //send a successful login state back to angular
  router.get('/success', function(req, res) {
    res.send({state: 'success', user: req.user ? req.user : null});
  });

  //sends failure login state back to angular
  router.get('/failure', function(req, res){
    res.send({state: 'failure', user: null, message: "Invaild username or password"});
  });

  //log in
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure',
    failureFlash: true
  }));

  //create user
  router.post('/createUser', passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure',
    failureFlash: true
  }));


  //log out
  router.get('/signout', function(req, res) {
    req.logout();
    req.redirect('/');
  });

  return router;
};
