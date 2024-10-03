const MasterList = require("./masterlist.model");
const UserRole = require("./userRole.model");
const Activity_Log = require("./activity_log.model");
const Department = require("./department.model");
const Section = require("./section.model");
const Course = require("./course.model");
const Subject = require("./subject.model");
const Team = require("./team.model");

UserRole.hasMany(MasterList, { foreignKey: "col_roleID" });
MasterList.belongsTo(UserRole, { foreignKey: "col_roleID" });

Course.hasMany(Subject, { foreignKey: "course_id" });
Subject.belongsTo(Course, { foreignKey: "course_id" });

module.exports = {
  MasterList,
  UserRole,
  Activity_Log,
  Department,
  Section,
  Course,
  Subject,
  Team,
};
