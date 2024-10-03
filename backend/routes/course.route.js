const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Course } = require("../db/models/associations");

router.route("/getCourse").get(async (req, res) => {
  try {
    const data = await Course.findAll();

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

router.route("/createCourse").post(async (req, res) => {
  try {
    const { courseName, courseCode, status } = req.body;

    const existingCourse = await Course.findOne({
      where: {
        course_name: courseName,
        course_code: courseCode,
      },
    });

    if (existingCourse) {
      return res.status(201).send("Exist");
    }

    const newData = await Course.create({
      course_name: courseName,
      course_code: courseCode,
      status: status,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateCourse/:param_id").put(async (req, res) => {
  try {
    const courseId = req.params.param_id;
    let { courseName, courseCode, status } = req.body;

    const existingData = await Course.findOne({
      where: {
        course_name: courseName,
        course_code: courseCode,

        id: { [Op.ne]: courseId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Course.update(
      {
        course_name: courseName,
        course_code: courseCode,
        status: status,
      },
      {
        where: { id: courseId },
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
