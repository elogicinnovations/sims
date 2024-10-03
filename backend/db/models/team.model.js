const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Team = sequelize.define("team", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  team_code: {
    type: DataTypes.STRING,
  },
  team_name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

module.exports = Team;
