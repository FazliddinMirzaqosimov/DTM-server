const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: {
    require: [true, "Section must have name"],
    unique: true,
    type: String,
  },
});

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
