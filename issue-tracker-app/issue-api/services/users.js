const config = require('../config/database');
const User = config.connect.import('../models/IssueTracker_Users');
const eType = config.connect.import('../models/IssueTracker_EmployeeTypes');
const uRoles = config.connect.import('../models/IssueTracker_UserRoles');
const Projects = config.connect.import('../models/IssueTracker_Projects');
const bcrypt = require('bcrypt');

//declare associations
User.hasMany(uRoles);
User.hasOne(eType);
User.hasMany(Projects);


module.exports.getUserObj = function(id, callback) {
  User.findById({
    id,
    include: [{ model: uRoles,
                model: eType,
                model: Projects}]

  })
  .then()
}

module.exports.getUserById = function(id, callback){
  User.findById(id)
	.then((user, err) => {
    return callback(err, user);
  });
};

module.exports.getUserByUsername = function(username, callback){
  User.findOne({
		where: {
			UserName: username
		}
	})
	.then((user, err) => {
			return callback(err, user);
	});
};

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.UserPassword, salt, (err, hash) => {
      if(err) throw err;
      newUser.UserPassword = hash;
      User.create(newUser).then((user, err) => {
        return callback(err, user);
      });
    });
  });
};

module.exports.hashPassword = function(password, callback) {
  bcrypt.hash(password, 10, function(err, hash) {
    return callback(err, hash);
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}

module.exports.getUserNamefromId = function(id, callback) {
  User.findOne({
    where: {UserId : id},
    attributes: ['UserName']
  })
  .then((user, err) => {
    return callback(err, user);
  });
}

module.exports.findAllUsers = function(callback) {
  User.findAll().then((users, err) => {
    return callback(err, users);
  });
};

module.exports.disableUser = function(id, callback) {

}

module.exports.updateUserRecord = function(id, user, pwFlag, callback) {
  //if the password field was left blank on editing a user, put the current
  //password back into the db with the update
  if(!pwFlag) {
    User.findOne({
      where: {UserId: id},
    }).then((result, err) => {
      user.UserPassword = result.UserPassword;
      User.update(
        user,
        {where: { UserId: id }},
      ).then((user, err) => {
        return callback(err, user);
      });
    });
  }
  else {
    //if there is a new password, enter it.
    User.update(
      user,
      {where: { UserId: id }},
    ).then((user, err) => {
      return callback(err, user);
      });
  }
};

module.exports.getEmployeeTypes = function(callback) {
  eType.findAll().then((eTypes, err) => {
    return callback(err, eTypes);
  });
};

module.exports.dropUser = function(id, callback) {
  User.findOne({
    where: {UserId: id},
  }).then((result, err) => {
    result.destroy({force:true});
    return callback(result, err);
  });
};
