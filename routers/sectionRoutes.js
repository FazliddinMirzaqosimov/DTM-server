const express = require("express");
const { restrictTo, routeProtector } = require("../controllers/authController");
const {
  getAllSections,
  createSection,
  getSection,
  deleteSection,
  editSection,
} = require("../controllers/sectionController");

const sectionRoutes = express.Router();

sectionRoutes
  .route("/")
  .get(getAllSections)
  .post(routeProtector, restrictTo("admin"), createSection);

sectionRoutes
  .route("/:id")
  .get(getSection)
  .delete(routeProtector, restrictTo("admin"), deleteSection)
  .patch(routeProtector, restrictTo("admin"), editSection);

module.exports = sectionRoutes;
