const express = require("express");
const { routeProtector, restrictTo } = require("../controllers/authController");
const { uploadSingle } = require("../controllers/imageController");
const {
  getAllTests,
  createTest,
  deleteTest,
  editTest,
  getTest,
} = require("../controllers/testControllers");
const testRoutes = express.Router();

testRoutes
  .route("/")
  .get(getAllTests)
  .post(routeProtector, restrictTo("admin"), uploadSingle, createTest);

testRoutes
  .route("/:id")
  .get(getTest)
  .delete(routeProtector, restrictTo("admin"), deleteTest)
  .patch(routeProtector, restrictTo("admin"), uploadSingle, editTest);

module.exports = testRoutes;
