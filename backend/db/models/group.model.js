const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Group = sequelize.define("group", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  group_code: {
    type: DataTypes.STRING,
  },
  group_name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

module.exports = Group;
