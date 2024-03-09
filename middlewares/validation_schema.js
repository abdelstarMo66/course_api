const { body } = require("express-validator");
// const validator = require("validator");

const courseValidationSchema = () => [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 3 })
    .withMessage("title at least 3 characters"),

  body("price").notEmpty().withMessage("price is required"),
];

const loginValidationSchema = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("must be a valid email address"),
    body("password").notEmpty().withMessage("password is required"),
  ];
};

module.exports = { courseValidationSchema, loginValidationSchema };
