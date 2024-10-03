const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Section = sequelize.define("section", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  section_code: {
    type: DataTypes.STRING,
  },
  section_name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

module.exports = Section;
