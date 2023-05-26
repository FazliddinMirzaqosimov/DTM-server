const { default: mongoose } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: { type: String },
  lastname: { type: String },
  number: { type: String },
  photo: { type: String },
  courses: [{ type: mongoose.Schema.ObjectId, ref: "Course" }],
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "guide", "admin"],
    default: "user",
  },
  passwordChangedAt: { type: Date, default: new Date() },
  passwordResetToken: String,
  passwordResetExpires: String,
  created: { type: Date, select: false, default: new Date() },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    this.passwordChangedAt = new Date();
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePasswords = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password);
};
userSchema.methods.changePasswordAfter = function (timestamp) {
  return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > timestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hash");

  this.passwordResetExpires = Date.now() + 3 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
