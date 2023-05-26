const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const sectionRoutes = require("./routers/sectionRoutes");
const testRoutes = require("./routers/testRoutes");
const userRoutes = require("./routers/userRouter");

const app = express();

app.use(express.json());
app.use(express.static("./img"));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/sections", sectionRoutes);
app.use("/api/v1/tests", testRoutes);

module.exports = app;
