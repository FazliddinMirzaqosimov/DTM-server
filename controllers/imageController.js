const multer = require("multer");
const path = require("path");

const multerStorage = multer.diskStorage({
  // destination: (req, res, cb) => {
  //   cb(null, "../img");
  // },
  // filename: (req, file, cb) => {
  //   const ext = file.mimetype.split("/")[1];
  //   cb(null, `lang-${req.user.id}-${Date.now()}.${ext}`);
  // },

  destination: (req, res, cb) => {
    cb(null, "./img");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  // console.log(111, file.mimetype);
  // if (file.mimetype.startsWith("image")) {
  //   cb(null, true);
  // }
  const imageExts = [".jfif", ".jpeg", ".png", ".jpg"];
  const ext = path.extname(file.originalname);

  if (file.mimetype.startsWith("image") || imageExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("please upload only images"));
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadSingle = upload.single("photo");
exports.uploadMulti = upload.single("photo");
