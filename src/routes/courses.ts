import express from "express";
import asyncHandler from "../middleware/async";
import CoursesController from "../controllers/CoursesController";

const router = express.Router({ mergeParams: true });

const coursesController = new CoursesController();

router
	.route("/")
	.get(asyncHandler(coursesController.getCourses))
	.post(asyncHandler(coursesController.addCourse));

router
	.route("/:id")
	.get(asyncHandler(coursesController.getCourse))
	.put(asyncHandler(coursesController.updateCourse))
	.delete(asyncHandler(coursesController.deleteCourse));

export default router;
