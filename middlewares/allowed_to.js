const appError = require("../utils/app_error");
const httpStatuesText = require("../utils/http_statues_text");

const allowTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const error = appError.create(
        "This role is not allowed for this user",
        400,
        httpStatuesText.ERROR
      );
      return next(error);
    }
    next();
  };
};

module.exports = allowTo;
