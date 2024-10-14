const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Group } = require("../db/models/associations");

router.route("/getGroup").get(async (req, res) => {
  try {
    const data = await Group.findAll();

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

router.route("/createGroup").post(async (req, res) => {
  try {
    const { groupName, groupCode, status } = req.body;

    const existingGroup = await Group.findOne({
      where: {
        group_name: groupName,
        group_code: groupCode,
      },
    });

    if (existingGroup) {
      return res.status(201).send("Exist");
    }

    const newData = await Group.create({
      group_name: groupName,
      group_code: groupCode,
      status: status,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateGroup/:param_id").put(async (req, res) => {
  try {
    const groupId = req.params.param_id;
    let { groupName, groupCode, status } = req.body;

    const existingData = await Group.findOne({
      where: {
        group_name: groupName,
        group_code: groupCode,

        id: { [Op.ne]: groupId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Group.update(
      {
        group_name: groupName,
        group_code: groupCode,
        status: status,
      },
      {
        where: { id: groupId },
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
