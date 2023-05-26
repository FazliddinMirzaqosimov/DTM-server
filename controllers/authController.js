const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const { sendSucces, sendError } = require("../utils/sendData");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return sendError(res, "Please provide both password and email", 404);
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return sendError(res, "No user in email " + email, 404);
    }
    if (!(await user.comparePasswords(password))) {
      return sendError(res, "Wrong password", 404);
    }

    const token = createToken(user._id);

    sendSucces(res, { user, token }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = createToken(user._id);

    sendSucces(res, { user, token }, 201);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.routeProtector = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return sendError(res, "You are not logged in", 401);
  }

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id);

  if (!user) {
    return sendError(res, "Token is not valid", 404);
  }
  if (user.changePasswordAfter(decoded.iat)) {
    return sendError(res, "User changed password. Please login again", 401);
  }
  req.user = user;
  next();
};

exports.restrictTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return sendError(res, "You are not allowed to this path", 404);
    next();
  };

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return sendError(res, "There is not user in this email address", 404);

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: true });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    try {
      await sendEmail({
        email: req.body.email,
        message: resetUrl,
        subject: "Your password reset url is active for 3 minute",
      });
      sendSucces(res, resetUrl, 200);
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: true });
      sendError(res, error.message, 500);
    }
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hash");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, "Reset token isnt valid", 404);
    }

    user.password = req.body.password;
    user.changePasswordAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: true });
    const token = createToken(user._id);

    sendSucces(res, { token }, 200);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};
