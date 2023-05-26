const { default: mongoose } = require("mongoose");

const testSchema = new mongoose.Schema({
  question: {
    require: [true, "Test must have question"],
    unique: true,
    type: String,
  },
  image: { type: String },
  variants: {
    require: [true, "Test must have at least one variant"],
    type: [
      {
        title: String,
        isAnswer: Boolean,
      },
    ],
  },
  section: {
    type: mongoose.Schema.ObjectId,
    ref: "Section",
  },
});

const Test = mongoose.model("Test", testSchema);
module.exports = Test;
