const express = require('express');
const router = express.Router();
const Sequelize = require ('sequelize');
const passport = require('passport');
const config = require('../config/database');
const bcrypt = require('bcrypt');
module.exports = router;

/* import database models */
const Users = require('../services/users');

// router.get('/', passport.authenticate('jwt', { session: false, }),
//   function(req, res, next) {
//     res.render('projects', { title: 'Projects' });
// });

router.get('/', (req, res, next) => {
  res.render('users');
});

/**
 *  GET users listing.
 *  test in bash with:
 *  curl localhost:3000/users
 */
router.get('/users.json', (req, res, next) => {
    Users.findAllUsers((err, users) => { //this function is a user-defined function
      if(err) throw err;                 // inside /models/users.js
      else {
        res.send(users);
      }
    });
  });

/**
 *  POST user (user create/insert)
 *  test in bash with:
 *  curl -XPOST http://localhost:3000/projects -d 'UserName={SOME_UNIQUE_NAME}&UserPassword={some password}&Email='test@decisionsource.com'&DisplayName={some name}&Disabled='false'&EmployeeTypeId=4'
 *  User ID is autoincremented
*/
router.post('/', (req, res, next) => {
    Users.addUser(req.body, (err, newUser) => {
      if(err){
        console.log('There was an error completing the insertion: ', err);
        res.send(err);
      }
      else{
        console.log(`New User ${newUser.UserName}, with id ${newUser.UserId} has been created.`);
        res.json(newUser);
      }
    });
});

/**
 *  GET user by id
 *  test in bash with
 *  curl -XGET http://localhost:3000/users/{SOME_UNIQUE_ID}
 */
router.get('/:id', (req, res, next) => {
    Users.getUserById(req.params.id, (err, user) => {
        if (err) {
          console.log('There was an error during the query: ', err);
          res.send(err);
        }
        else {
            console.log(`User: ${user.UserName}`);
            res.json(user);
        }
    });
});

/**
 *  PUT project by id (update project)
 *  test in bash with
 *  curl -XPUT http://localhost:3000/projects/{SOME_UNIQUE_ID} -d 'ProjectId={SOME_UNIQUE_ID}&ProjectClient=Some%20Other%20Guy&ProjectName=REST%20api&ProjectDescription=another%20test&ProjectCreatorId=82&ProjectManagerId=82&ProjectDisabled=false'
*/
router.put('/:id', (req, res, next) => {
  if(req.body.UserPassword == "") {
      console.log('if');
      Users.updateUserRecord(req.params.id, req.body, false, (err, user) => {
        if(err){
          console.log('There was an error completing the insertion: ', err);
          res.send(err);
        }
        else {
          res.json(user);
        }
      });
    }
    else {
      bcrypt.hash(req.body.UserPassword, 10, function(err, hash) {
        if(err) {
          res.send(err);
        }
        else {
          console.log(hash);
          req.body.UserPassword = hash;
          Users.updateUserRecord(req.params.id, req.body, true, (err, user) => {
            if(err){
              console.log('There was an error completing the insertion: ', err);
              res.send(err);
            }
            else {
              res.json(user);
            }
          });
        }
      });
    }
});

/**
 *  DELETE user by id (may not be necessary)
 *  test in bash with
 *  curl -XDELETE http://localhost:3000/users/{SOME_UNIQUE_ID}
*/
router.delete('/:id', (req, res, next) => {
  Users.dropUser(req.params.id, (err, user) => {
    if (err)
      res.send(err);
    else{
      res.json({success: 'true', message: 'success'});
    }
  });
});
