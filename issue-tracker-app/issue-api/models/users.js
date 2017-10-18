const config = require('../config/database');
const User = config.connect.import('../models/IssueTracker_Users');
const bcrypt = require('bcrypt');

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
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
