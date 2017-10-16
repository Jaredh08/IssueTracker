var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var Sequelize = require('sequelize')
//var conn = require('./public/javascripts/conn')(dbConnect);

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

const User = conn.import('./models/IssueTracker_Users.js');

module.exports = function(passport) {

  //let passport serialize the user
  passport.serializeUser(function(user, done) {
    console.log('serializing user: ', user.UserName);
    done(null, user.UserId);
  });

  //let passport de-serialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id)
    .then((user, err) => {
      console.log('deserializing user: ', user.UserName);
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
    passReqToCallBack : true
    },
    function(username, password, done) {
      console.log('username: '+ username, 'password: ' + password);
      //check database to see if a user with this username exists
      User.findOne({
        where: {
          UserName: username
        }
      })
      .then((user, err) => {
          //In case of an error, return with done method
          if (err)
            return done(err);
          //username does not exist, log and redirect
          if(!user) {
            console.log('User Not Found with this Username '+username);
            return done(null, false);
          }
          //wrong password
          if(!isValidPassword(user, password)){
            console.log('Invalid Password');
            return done(null, false);
          }
          //if the decision falls past all of the above gates, then the user has
          //logged in successfully
          return done(null, user);
          //// TODO add JWT functionality
      });
    }
  ));

  //create user, to be used by create user functions
  passport.use(new LocalStrategy({
      passReqToCallBack: true //allows pass back or request to callback
    },
    function(username, password, done) {
      console.log('username: '+ username, 'password: ' + password);
      findOrCreateUser = function() {
        //find a user in the db
        User.findOne({
          where: {
            UserName: username
          }
        })
        .then((user, err) => {
          //if there is an error, return with done method
          if (err) {
            console.log('Error in Signup: ' + err);
            return done(err);
          }
          // user already exists
          if(user) {
            console.log('User already exists with this username: ' + username);
            return done(null, false);
          }
          else {
            console.log('We are here, user is not in DB');
            //put user in db
            User.create({
              UserName: username,
              UserPassword: createHash(password),
              Email: 'placeholder@decisionsource.com', //placeholder
              DisplayName: username, //placeholder
              Diabled: false, //placeholder
              StartDate: null, //placeholder
              EmployeeTypeId: 4 //placeholder
            })
            .then((created, err) => {
              if(err){
                console.log('Error in Creating User: ' + err);
                throw err;
              }
              console.log(created.username + 'Successful Insertion');
              return done(null, created);
            }
          );
          }
        });
      };
      //we need to delay the execution of findOrCreateUser until the next tick
      //of the event loop
      process.nextTick(findOrCreateUser);
    })
  );

  var isValidPassword = function(user, password) {
    return bcrypt.compareSync(password, user.UserPassword);
  };

  var createHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };
};
