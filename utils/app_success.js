const httpStatusText = require("./http_statues_text");

const successResponse = (message, code, data) => {
  return {
    status: httpStatusText.SUCCESS,
    message: message || "Find Data Successfully",
    code: code || 200,
    data: data || null,
  };
};

module.exports = successResponse;
