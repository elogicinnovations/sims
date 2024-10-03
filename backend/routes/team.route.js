const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Team } = require("../db/models/associations");

router.route("/getTeam").get(async (req, res) => {
  try {
    const data = await Team.findAll();

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

router.route("/createTeam").post(async (req, res) => {
  try {
    const { teamName, teamCode, status } = req.body;

    const existingTeam = await Team.findOne({
      where: {
        team_name: teamName,
        team_code: teamCode,
      },
    });

    if (existingTeam) {
      return res.status(201).send("Exist");
    }

    const newData = await Team.create({
      team_name: teamName,
      team_code: teamCode,
      status: status,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateTeam/:param_id").put(async (req, res) => {
  try {
    const teamId = req.params.param_id;
    let { teamName, teamCode, status } = req.body;

    const existingData = await Team.findOne({
      where: {
        team_name: teamName,
        team_code: teamCode,

        id: { [Op.ne]: teamId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Team.update(
      {
        team_name: teamName,
        team_code: teamCode,
        status: status,
      },
      {
        where: { id: teamId },
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
