const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Staff } = require("../db/models/associations");

router.route("/getStaff").get(async (req, res) => {
  try {
    const data = await Staff.findAll();

    if (data) {
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/createStaff").post(async (req, res) => {
  try {
    const {
      employeeNo,
      designation,
      departmentId,
      firstName,
      lastName,
      middleName,
      initial,
      contact,
      email,
      status,
      userName,
      password,
      userRole,
      department,
      staffImages,
    } = req.body;

    const existingStaff = await Staff.findOne({
      where: {
        employee_no: employeeNo,
      },
    });

    if (existingStaff) {
      return res.status(201).send("Exist");
    }

    const newData = await Staff.create({
      employee_no: employeeNo,
      designation: designation,
      department_id: departmentId,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      initial: initial,
      contact: contact,
      email: email,
      status: status,
      username: userName,
      password: password,
      col_id: userRole,
      department_id: department,
      staff_image: staffImages,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateStaff/:param_id").put(async (req, res) => {
  try {
    const staffId = req.params.param_id;
    let {
      employeeNo,
      designation,
      departmentId,
      firstName,
      lastName,
      middleName,
      initial,
      contact,
      email,
      status,
      username,
      password,
      userRole,
    } = req.body;

    const existingData = await Staff.findOne({
      where: {
        employee_no: employeeNo,
        id: { [Op.ne]: staffId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Staff.update(
      {
        employee_no: employeeNo,
        designation: designation,
        department_id: departmentId,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        initial: initial,
        contact: contact,
        email: email,
        status: status,
        username: username,
        password: password,
        col_id: userRole,
      },
      {
        where: { id: staffId },
      }
    );
    res
      .status(200)
      .json({ message: "Data updated successfully", affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
