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
  initial: {
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
  col_id: {
    type: DataTypes.INTEGER,
  },
  staff_image: {
    type: DataTypes.BLOB("long"),
    allowNull: true,
    get() {
      const value = this.getDataValue("staff_image");
      return value ? value.toString("base64") : null;
    },
    set(value) {
      if (value) {
        this.setDataValue("staff_image", Buffer.from(value, "base64"));
      } else {
        this.setDataValue("staff_image", null);
      }
    },
  },
});

module.exports = Staff;
