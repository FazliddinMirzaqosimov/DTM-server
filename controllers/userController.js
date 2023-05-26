const User = require("../models/userModel");
const fs = require("fs");
const APIFeatures = require("../utils/apiFeatures");
const { sendError, sendSucces } = require("../utils/sendData");

exports.getAllUsers = async (req, res) => {
  try {
    const usersQuery = new APIFeatures(User.find(), req.query)
      .sort()
      .filter()
      .paginate()
      .limitFields();

    sendSucces(res, { users: await usersQuery.query }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    sendSucces(res, { user }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    sendSucces(res, { user }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      ...(req.file?.filename
        ? { photo: `${process.env.APP_URL}/${req.file.filename}` }
        : {}),
    });
    sendSucces(res, { user }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.editUser = async (req, res) => {
  try {
    console.log(req.file);

    const user = await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
      ...(req.file?.filename
        ? { photo: `${process.env.APP_URL}/${req.file.filename}` }
        : {}),
    });
    console.log(111);
    fs.unlink(`./img/${user.photo?.split("/").slice(-1)[0]}`, (err) => {
      console.log(err);
    });
    sendSucces(res, { user }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};
