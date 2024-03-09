const express = require("express");
const multer = require("multer");

const userController = require("../controllers/user_controller");
const { loginValidationSchema } = require("../middlewares/validation_schema");
const verifyToken = require("../middlewares/verify_token");
const allowTo = require("../middlewares/allowed_to");
const userRole = require("../utils/user_roles");
const appError = require("../utils/app_error");
const httpStatusText = require("../utils/http_statues_text");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(null, uniqueSuffix + "." + file.mimetype.split("/")[1]);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(
      appError.create("the file must be an image", 400, httpStatusText.ERROR),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.get(
  "/",
  verifyToken,
  allowTo(userRole.admin, userRole.manager),
  userController.getAllUsers
);

router.post("/login", loginValidationSchema(), userController.login);

router.post("/register", upload.single("image"), userController.register);

module.exports = router;
