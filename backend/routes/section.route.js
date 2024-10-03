const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Section } = require("../db/models/associations");

router.route("/getSection").get(async (req, res) => {
  try {
    const data = await Section.findAll();

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

router.route("/createSection").post(async (req, res) => {
  try {
    const { sectionName, sectionCode, status } = req.body;

    const existingSection = await Section.findOne({
      where: {
        section_name: sectionName,
        section_code: sectionCode,
      },
    });

    if (existingSection) {
      return res.status(201).send("Exist");
    }

    const newData = await Section.create({
      section_name: sectionName,
      section_code: sectionCode,
      status: status,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateSection/:param_id").put(async (req, res) => {
  try {
    const sectionId = req.params.param_id;
    let { sectionName, sectionCode, status } = req.body;

    const existingData = await Section.findOne({
      where: {
        section_name: sectionName,
        section_code: sectionCode,

        id: { [Op.ne]: sectionId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Section.update(
      {
        section_name: sectionName,
        section_code: sectionCode,
        status: status,
      },
      {
        where: { id: sectionId },
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
