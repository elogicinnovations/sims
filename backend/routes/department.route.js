const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Department } = require("../db/models/associations");

router.route("/getDepartment").get(async (req, res) => {
  try {
    const data = await Department.findAll();

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

router.route("/createDepartment").post(async (req, res) => {
  try {
    const { departmentName, departmentCode, status } = req.body;

    const existingDepartment = await Department.findOne({
      where: {
        department_name: departmentName,
        department_code: departmentCode,
      },
    });

    if (existingDepartment) {
      return res.status(201).send("Exist");
    }

    const newData = await Department.create({
      department_name: departmentName,
      department_code: departmentCode,
      status: status,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateDepartment/:param_id").put(async (req, res) => {
  try {
    const departmentId = req.params.param_id;
    let { departmentName, departmentCode, status } = req.body;

    const existingData = await Department.findOne({
      where: {
        department_name: departmentName,
        department_code: departmentCode,

        id: { [Op.ne]: departmentId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Department.update(
      {
        department_name: departmentName,
        department_code: departmentCode,
        status: status,
      },
      {
        where: { id: departmentId },
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
