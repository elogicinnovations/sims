const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Department = sequelize.define("department", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  department_code: {
    type: DataTypes.STRING,
  },
  department_name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

module.exports = Department;
