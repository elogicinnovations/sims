const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Staff = sequelize.define("staff", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_no: {
    type: DataTypes.INTEGER,
  },
  designation: {
    type: DataTypes.STRING,
  },
  department_id: {
    type: DataTypes.INTEGER,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  middle_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  initial_name: {
    type: DataTypes.STRING,
  },
  contact: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  user: {
    type: DataTypes.STRING,
  },
});

module.exports = Staff;
