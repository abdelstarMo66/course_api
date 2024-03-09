const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const asyncWrapper = require("../middlewares/async_wrapper");
const successResponse = require("../utils/app_success");
const Users = require("../models/user_model");
const appError = require("../utils/app_error");
const httpStatusText = require("../utils/http_statues_text");
const generateToken = require("../utils/generate_jwt");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  const users = await Users.find({}, { __v: false, password: false })
    .sort({ name: "asc" })
    .limit(limit)
    .skip(skip);

  res.json(successResponse("Users Found", 200, { users }));
});

const register = asyncWrapper(async (req, res, next) => {
  let { name, email, password, role } = req.body;
  role = role.toUpperCase();

  const oldUser = await Users.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "user already exists",
      400,
      httpStatusText.FAILURE
    );
    return next(error);
  }

  const hashPassword = await bcrypt.hash(password.toString(), 10);
  const user = new Users({
    name,
    email,
    password: hashPassword,
    role,
    image: req.file.path,
  });

  const token = await generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  await user.save();

  return res.status(201).json(
    successResponse("User created successfully", 201, {
      user: user,
      token: token,
    })
  );
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(
      errors.array()[0].msg,
      400,
      httpStatusText.FAILURE
    );
    return next(error);
  }

  const user = await Users.findOne({ email: email });

  const matchPassword = await bcrypt.compare(
    password.toString(),
    user.password
  );

  if (user && matchPassword) {
    const token = await generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.json(successResponse("Login Successfully", 200, { token }));
  } else {
    const error = appError.create(
      "email or password is wrong",
      400,
      httpStatusText.FAILURE
    );
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
