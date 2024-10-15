const router = require("express").Router();
const { where, Op } = require("sequelize");
const { Company, Staff } = require("../db/models/associations");

router.route("/getCompany").get(async (req, res) => {
  try {
    const data = await Company.findAll({
      include: [
        {
          model: Staff,
        },
      ],
    });

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

router.route("/createCompany").post(async (req, res) => {
  try {
    const {
      companyName,
      staff,
      companyAddress,
      contactPerson,
      contactNo,
      nationality,
      technicalCoordinator,
      billingAddress,
      billingSchedule,
      billingRemarks,
      status,
      subsidyRate,
      alumni,
      wtChairman,
      products,
      trainingPlan,
      trainingAssignment,
      collectionAddress,
      collectionSchedule,
      collectionRemarks,
      others,
      email,
    } = req.body;

    const existingCompany = await Company.findOne({
      where: {
        company_name: companyName,
      },
    });

    if (existingCompany) {
      return res.status(201).send("Exist");
    }

    const newData = await Company.create({
      company_name: companyName,
      staff_id: staff,
      address: companyAddress,
      contact_person: contactPerson,
      contact_number: contactNo,
      nationality: nationality,
      technical_coordinator: technicalCoordinator,
      billing_address: billingAddress,
      billing_schedule: billingSchedule,
      billing_remarks: billingRemarks,
      status: status,
      subsidy_rate: subsidyRate,
      alumni: alumni,
      wt_chairman: wtChairman,
      products: products,
      training_plan: trainingPlan,
      training_assignment: trainingAssignment,
      collection_address: collectionAddress,
      collection_schedule: collectionSchedule,
      collection_remarks: collectionRemarks,
      others: others,
      email: email,
    });

    res.status(200).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateCompany/:param_id").put(async (req, res) => {
  try {
    const companyId = req.params.param_id;
    let {
      companyName,
      staff,
      companyAddress,
      contactPerson,
      contactNo,
      nationality,
      technicalCoordinator,
      billingAddress,
      billingSchedule,
      billingRemarks,
      status,
      subsidyRate,
      alumni,
      wtChairman,
      products,
      trainingPlan,
      trainingAssignment,
      collectionAddress,
      collectionSchedule,
      collectionRemarks,
      others,
      email,
    } = req.body;

    const existingData = await Company.findOne({
      where: {
        company_name: companyName,

        id: { [Op.ne]: companyId },
      },
    });

    if (existingData) {
      return res.status(202).send("Exist");
    }

    const affectedRows = await Company.update(
      {
        company_name: companyName,
        staff_id: staff,
        address: companyAddress,
        contact_person: contactPerson,
        contact_number: contactNo,
        nationality: nationality,
        technical_coordinator: technicalCoordinator,
        billing_address: billingAddress,
        billing_schedule: billingSchedule,
        billing_remarks: billingRemarks,
        status: status,
        subsidy_rate: subsidyRate,
        alumni: alumni,
        wt_chairman: wtChairman,
        products: products,
        training_plan: trainingPlan,
        training_assignment: trainingAssignment,
        collection_address: collectionAddress,
        collection_schedule: collectionSchedule,
        collection_remarks: collectionRemarks,
        others: others,
        email: email,
      },
      {
        where: { id: companyId },
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
