const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Scholarship } = require("../db/models/associations");

router.route("/getScholarship").get(async (req, res) => {
  try {
    const data = await Scholarship.findAll();

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

router.route("/createScholarship").post(async (req, res) => {
  try {
    const {
      sponsorName,
      sponsorDate,
      tuition,
      subsistence,
      address,
      email,
      contactPerson,
      contactNo,
      status,
    } = req.body;

    const existingScholarship = await Scholarship.findOne({
      where: {
        sponsor_name: sponsorName,
      },
    });

    if (existingScholarship) {
      return res.status(201).send("Exist");
    }

    const newData = await Scholarship.create({
      sponsor_name: sponsorName,
      sponsor_date: sponsorDate,
      tuition: tuition,
      subsistence: subsistence,
      address: address,
      email: email,
      contact_person: contactPerson,
      contact_number: contactNo,
      status: status,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateScholarship/:param_id").put(async (req, res) => {
  try {
    const scholarshipId = req.params.param_id;
    let {
      sponsorName,
      sponsorDate,
      tuition,
      subsistence,
      address,
      email,
      contactPerson,
      contactNo,
      status,
    } = req.body;

    const existingData = await Scholarship.findOne({
      where: {
        sponsor_name: sponsorName,

        id: { [Op.ne]: scholarshipId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Scholarship.update(
      {
        sponsor_name: sponsorName,
        sponsor_date: sponsorDate,
        tuition: tuition,
        subsistence: subsistence,
        address: address,
        email: email,
        contact_person: contactPerson,
        contact_number: contactNo,
        status: status,
      },
      {
        where: { id: scholarshipId },
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
