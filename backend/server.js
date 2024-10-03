const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

const port = 8086;

app.use(cors());
app.use(express.json());

const masterRoute = require("./routes/masterlist.route");
const userRoute = require("./routes/userRole.route");
const department = require("./routes/department.route");
const section = require("./routes/section.route");
const course = require("./routes/course.route");
const subject = require("./routes/subject.route");
const team = require("./routes/team.route");

app.use("/masterList", masterRoute);
app.use("/userRole", userRoute);
app.use("/department", department);
app.use("/section", section);
app.use("/course", course);
app.use("/subject", subject);
app.use("/team", team);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
