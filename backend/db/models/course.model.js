const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Course = sequelize.define("course", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  course_code: {
    type: DataTypes.STRING,
  },
  course_name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

module.exports = Course;
