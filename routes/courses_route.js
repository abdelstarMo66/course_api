const express = require("express");
const courseController = require("../controllers/course_controller");
const { courseValidationSchema } = require("../middlewares/validation_schema");

const router = express.Router();

router
  .route("/")
  .get(courseController.getCourses)
  .post(courseValidationSchema(), courseController.addCourse);

router
  .route("/:courseID")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
