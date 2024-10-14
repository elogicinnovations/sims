const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Scholarship = sequelize.define("scholarship", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  sponsor_name: {
    type: DataTypes.STRING,
  },
  sponsor_date: {
    type: DataTypes.DATE,
  },
  tuition: {
    type: DataTypes.DOUBLE,
  },
  subsistence: {
    type: DataTypes.DOUBLE,
  },
  address: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  contact_person: {
    type: DataTypes.STRING,
  },
  contact_number: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
});

module.exports = Scholarship;
