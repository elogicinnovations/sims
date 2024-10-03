const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Subject = sequelize.define("subject", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
  },
  subject_code: {
    type: DataTypes.STRING,
  },
  subject_name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  term: {
    type: DataTypes.STRING,
  },
  unit: {
    type: DataTypes.INTEGER,
  },
  unit_hours: {
    type: DataTypes.INTEGER,
  },
  numeric: {
    type: DataTypes.STRING,
  },
  competency: {
    type: DataTypes.STRING,
  },
});

module.exports = Subject;
