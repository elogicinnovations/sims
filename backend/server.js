const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

const port = 8086;

app.use(cors());
app.use(express.json()); // Add this line to parse incoming JSON data

//Routes:
const masterRoute = require("./routes/masterlist.route");
const userRoute = require("./routes/userRole.route");
const department = require("./routes/department.route");

app.use("/masterList", masterRoute);
app.use("/userRole", userRoute);
app.use("/department", department);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
