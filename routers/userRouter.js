const express = require("express");
const {
  register,
  login,
  routeProtector,
  forgotPassword,
  resetPassword,
  restrictTo,
} = require("../controllers/authController");
const { uploadSingle } = require("../controllers/imageController");
const {
  getAllUsers,
  getUser,
  deleteUser,
  editUser,
  createUser,
} = require("../controllers/userController");

const userRoutes = express.Router();

userRoutes.route("/signin").post(login);
userRoutes.route("/signup").post(register);
userRoutes.route("/forgotPassword").post(forgotPassword);
userRoutes.route("/resetPassword/:token").patch(resetPassword);

userRoutes
  .route("/")
  .get(routeProtector, getAllUsers)
  .post(routeProtector, restrictTo("admin"), uploadSingle, createUser);

userRoutes
  .route("/:id")
  .get(routeProtector, getUser)
  .delete(routeProtector, restrictTo("admin"), deleteUser)
  .patch(routeProtector, restrictTo("admin"), uploadSingle, editUser);

module.exports = userRoutes;
