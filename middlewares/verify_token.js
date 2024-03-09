const jwt = require("jsonwebtoken");
const httpStatuesText = require("../utils/http_statues_text");
const appError = require("../utils/app_error");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    const error = appError.create(
      "token is required",
      400,
      httpStatuesText.ERROR
    );
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create(
      "UnAuthorized (invalid token)",
      401,
      httpStatuesText.ERROR
    );
    return next(error);
  }
};

module.exports = verifyToken;
