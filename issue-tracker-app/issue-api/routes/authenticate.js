var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize')
//var conn = require('./public/javascripts/conn')(dbConnect);



module.exports = function(passport) {

  /* establish a connection with the database */
  const conn = new Sequelize('issueTrackerDB', 'ApolloAdmin', 'IssueTracker2017', {
      host: 'mtsu-4700-2017.database.windows.net',
      dialect: 'mssql',
      driver: 'tedious',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      port: 1433,
      dialectOptions: {
        encrypt: true
      }
  });
  // authenticate the connection
  conn
      .authenticate()
      .then(() => {
          console.log('Connection has been established successfully - auth.');
      })
      .catch(err => {
          console.error('Unable to connect to the database:', err);
  });

  const User = conn.import('../models/IssueTracker_Users.js');

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
    failureRedicrect: '/auth/failure',
    failureFlash: true
  }))

  //create user
  router.post('/createUser', passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedicrect: '/auth/failure',
    failureFlash: true
  }));

  //log out
  router.get('/signout', function(req, res) {
    req.logout();
    req.redirect('/');
  });

  //delete entry by id (for getting rid of multiple entries)
  router.delete('/drop/:id', (req, res, next) => {
      console.log(req.params.id);
      User.destroy({
        where: {
          UserId: req.params.id,
        }
      })
      .then(result => {
        console.log('Deleted user: $result.UserId - $result.UserName');
      });
  });
  return router;
};
