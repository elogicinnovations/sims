const sequelize = require("../config/sequelize.config");
const { DataTypes } = require("sequelize");

const Company = sequelize.define("company", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {
    type: DataTypes.STRING,
  },
  staff_id: {
    type: DataTypes.INTEGER,
  },
  address: {
    type: DataTypes.STRING,
  },
  contact_person: {
    type: DataTypes.STRING,
  },
  contact_number: {
    type: DataTypes.STRING,
  },
  nationality: {
    type: DataTypes.STRING,
  },
  technical_coordinator: {
    type: DataTypes.STRING,
  },
  billing_address: {
    type: DataTypes.STRING,
  },
  billing_schedule: {
    type: DataTypes.STRING,
  },
  billing_remarks: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  subsidy_rate: {
    type: DataTypes.DOUBLE,
  },
  alumni: {
    type: DataTypes.STRING,
  },
  wt_chairman: {
    type: DataTypes.STRING,
  },
  products: {
    type: DataTypes.STRING,
  },
  training_plan: {
    type: DataTypes.STRING,
  },
  training_assignment: {
    type: DataTypes.STRING,
  },
  collection_address: {
    type: DataTypes.STRING,
  },
  collection_schedule: {
    type: DataTypes.STRING,
  },
  collection_remarks: {
    type: DataTypes.STRING,
  },
  others: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
});

module.exports = Company;
