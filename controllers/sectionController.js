const Section = require("../models/sectionModel");
const Test = require("../models/testModel");
const APIFeatures = require("../utils/apiFeatures");
const { sendSucces, sendError } = require("../utils/sendData");

exports.getAllSections = async (req, res) => {
  try {
    const sectionQuery = new APIFeatures(Section.find(), req.query)
      .sort()
      .filter()
      .paginate()
      .limitFields();

    sendSucces(res, { sections: await sectionQuery.query }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.getSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    sendSucces(res, { section }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    await Test.deleteMany({ section: section._id });
    sendSucces(res, { section }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.createSection = async (req, res) => {
  try {
    console.log(req.body);
    const section = await Section.create(req.body);
    sendSucces(res, { section }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.editSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body);
    sendSucces(res, { section }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};
