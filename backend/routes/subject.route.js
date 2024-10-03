const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Subject, Course } = require("../db/models/associations");

router.route("/getSubject").get(async (req, res) => {
  const { course_id } = req.query;
  try {
    const whereClause = course_id ? { where: { course_id } } : {};

    const data = await Subject.findAll(whereClause);

    if (data) {
      return res.json(data);
    } else {
      res.status(400).send("No subjects found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/createSubject").post(async (req, res) => {
  try {
    const {
      subjectName,
      subjectCode,
      status,
      courseId,
      term,
      unit,
      unitHours,
      numeric,
      competency,
    } = req.body;

    const existingSubject = await Subject.findOne({
      where: {
        subject_name: subjectName,
        subject_code: subjectCode,
      },
    });

    if (existingSubject) {
      return res.status(201).send("Exist");
    }

    const newData = await Subject.create({
      subject_name: subjectName,
      subject_code: subjectCode,
      status: status,
      course_id: courseId,
      term: term,
      unit: unit,
      unit_hours: unitHours,
      numeric: numeric,
      competency: competency,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateSubject/:param_id").put(async (req, res) => {
  try {
    const subjectId = req.params.param_id;
    let {
      subjectName,
      subjectCode,
      status,
      term,
      unit,
      unitHours,
      numeric,
      competency,
    } = req.body;

    const existingData = await Subject.findOne({
      where: {
        subject_name: subjectName,
        subject_code: subjectCode,

        id: { [Op.ne]: subjectId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Subject.update(
      {
        subject_name: subjectName,
        subject_code: subjectCode,
        status: status,
        term: term,
        unit: unit,
        unit_hours: unitHours,
        numeric: numeric,
        competency: competency,
      },
      {
        where: { id: subjectId },
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

router.route("/getCourseNameById").get(async (req, res) => {
  const { course_id } = req.query;

  try {
    const data = await Course.findOne({
      where: { id: course_id },
    });

    if (data) {
      return res.json({ courseName: data.course_name });
    } else {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
