const mongoose = require("mongoose");
const validate = require("validator");

const userRole = require("../utils/user_roles");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validate.isEmail, "filed must be a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [userRole.user, userRole.admin, userRole.manager],
    default: userRole.user,
  },
  image: {
    type: String,
    default: "uploads/default.jpg",
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
