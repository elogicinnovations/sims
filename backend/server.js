const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");

const port = 8086;

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "500mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 100000,
  })
);

const masterRoute = require("./routes/masterlist.route");
const userRoute = require("./routes/userRole.route");
const department = require("./routes/department.route");
const section = require("./routes/section.route");
const course = require("./routes/course.route");
const subject = require("./routes/subject.route");
const team = require("./routes/team.route");
const staff = require("./routes/staff.route");
const group = require("./routes/group.route");
const requirement = require("./routes/requirement.route");
const scholarship = require("./routes/scholarship.route");

app.use("/masterList", masterRoute);
app.use("/userRole", userRoute);
app.use("/department", department);
app.use("/section", section);
app.use("/course", course);
app.use("/subject", subject);
app.use("/team", team);
app.use("/staff", staff);
app.use("/group", group);
app.use("/requirement", requirement);
app.use("/scholarship", scholarship);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
