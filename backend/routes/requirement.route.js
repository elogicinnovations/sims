const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Requirement } = require("../db/models/associations");

router.route("/getRequirement").get(async (req, res) => {
  try {
    const data = await Requirement.findAll();

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

router.route("/createRequirement").post(async (req, res) => {
  try {
    const { requirementName, requirementType, status, required } = req.body;

    const existingRequirement = await Requirement.findOne({
      where: {
        requirement_name: requirementName,
        requirement_type: requirementType,
      },
    });

    if (existingRequirement) {
      return res.status(201).send("Exist");
    }

    const newData = await Requirement.create({
      requirement_name: requirementName,
      requirement_type: requirementType,
      status: status,
      required: required,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateRequirement/:param_id").put(async (req, res) => {
  try {
    const requirementId = req.params.param_id;
    let { requirementName, requirementType, status, required } = req.body;

    const existingData = await Requirement.findOne({
      where: {
        requirement_name: requirementName,
        requirement_type: requirementType,

        id: { [Op.ne]: requirementId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Requirement.update(
      {
        requirement_name: requirementName,
        requirement_type: requirementType,
        status: status,
        required: required,
      },
      {
        where: { id: requirementId },
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
