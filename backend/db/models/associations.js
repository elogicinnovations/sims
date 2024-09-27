const MasterList = require("./masterlist.model");
const UserRole = require("./userRole.model");
const Department = require("./department.model");

UserRole.hasMany(MasterList, { foreignKey: "userrole_id" }); // ginamit
MasterList.belongsTo(UserRole, { foreignKey: "userrole_id" }); // gumamit

module.exports = {
  MasterList,
  UserRole,
  Department,
};
