const { validationResult } = require("express-validator");

const Course = require("../models/course_model");
const httpStatusText = require("../utils/http_statues_text");
const asyncWrapper = require("../middlewares/async_wrapper");
const appError = require("../utils/app_error");
const successResponse = require("../utils/app_success");

const getCourses = asyncWrapper(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false })
    .sort({ price: "asc" })
    .limit(limit)
    .skip(skip);

  return res.json(successResponse(null, null, { courses }));
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const courseID = req.params.courseID;
  const course = await Course.findById(courseID, { __v: false });

  if (!course) {
    const error = appError.create(
      "Course Not Found",
      404,
      httpStatusText.FAILURE
    );
    return next(error);
  }
  return res.json(successResponse(null, null, { course }));
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(
      errors.array()[0].msg,
      400,
      httpStatusText.FAILURE
    );
    return next(error);
  }

  const course = new Course(req.body);
  await course.save();
  return res
    .status(201)
    .json(successResponse("course created successfully", 201, { course }));
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseID = req.params.courseID;

  await Course.findByIdAndUpdate(courseID, {
    $set: { ...req.body },
  });

  const course = await Course.findById(courseID, { __v: false });

  return res.json(
    successResponse("course updated successfully", null, { course })
  );
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseID = req.params.courseID;
  const course = await Course.findById(courseID);
  if (!course) {
    const error = appError.create(
      "Course Not Found",
      404,
      httpStatusText.FAILURE
    );
    return next(error);
  }

  await Course.deleteOne({ _id: courseID });

  return res.json(successResponse("course deleted successfully", null, null));
});

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
