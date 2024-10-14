const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Requirement = sequelize.define("requirement", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  requirement_type: {
    type: DataTypes.STRING,
  },
  requirement_name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  required: {
    type: DataTypes.STRING,
  },
});

module.exports = Requirement;
