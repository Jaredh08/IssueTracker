const config = require('../config/database');
const UserRoles = config.connect.import('../models/IssueTracker_UserRoles');
var roles;

module.exports.getRolesById = function(id, callback) {
  UserRoles.findAll({
    where: { UserId: id }
  })
  .then((roles, err) => {
    return callback(err, listify(roles));
  });
};

//function that parses the raw object that comes from the sequelize query
var listify = function(roles) {
  var rolelist = [];
  for (var i = 0; i < roles.length; i++){
    rolelist.push(roles[i].dataValues.RoleId)
  }
  return rolelist;
};
