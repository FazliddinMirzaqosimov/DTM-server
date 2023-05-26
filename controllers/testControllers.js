const Test = require("../models/testModel");
const APIFeatures = require("../utils/apiFeatures");
const fs = require("fs");
const { sendSucces, sendError } = require("../utils/sendData");

exports.getAllTests = async (req, res) => {
  try {
    const testQuery = new APIFeatures(Test.find(), req.query)
      .sort()
      .filter()
      .paginate()
      .limitFields();

    sendSucces(res, { tests: await testQuery.query }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    sendSucces(res, { test }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    sendSucces(res, { test }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.createTest = async (req, res) => {
  try {
    const variants = JSON.parse(req.body.variants);
    const test = await Test.create({
      ...req.body,
      variants,
      ...(req.file?.filename
        ? { image: `${process.env.APP_URL}/${req.file.filename}` }
        : {}),
    });
    sendSucces(res, { test }, 200);
  } catch (error) {
    req.file?.filename &&
      fs.unlink(`./img/${req.file.filename}`, (err) => {
        console.log(err);
      });
    sendError(res, error.message, 404);
  }
};

exports.editTest = async (req, res) => {
  try {
    console.log(req.body);
    const variants = JSON.parse(req.body.variants);

    const test = await Test.findByIdAndUpdate(req.params.id, {
      ...req.body,
      variants,
      ...(req.file?.filename
        ? { image: `${process.env.APP_URL}/${req.file.filename}` }
        : {}),
    });
    test.photo &&
      fs.unlink(`./img/${test.photo.split("/").slice(-1)[0]}`, (err) => {
        console.log(err);
      });

    sendSucces(res, { test }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};
