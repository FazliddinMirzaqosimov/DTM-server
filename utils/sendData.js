exports.sendWithToken = () => {};
exports.sendError = (res, error = "Somthing went wrong", status = 404) => {
  res.status(status).json({ status: "failed", error });
};
exports.sendSucces = (res, data = {}, status = 200) => {
  res.status(status).json({ status: "success", data });
};
