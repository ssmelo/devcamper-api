import ErrorResponse from "../utils/ErrorResponse";
import { Course } from "../models/Course";
import { NextFunction, Request, Response } from "express";
import { Bootcamp } from "../models/Bootcamp";

class CoursesController {
	// @desc Get courses
	// @route GET /api/v1/courses
	// @route GET /api/v1/bootcamps/:bootcampId/courses
	// @access Public
	public async getCourses(request: Request, response: Response, next: NextFunction) {
		let query;

		if (request.params.bootcampId) {
			query = Course.find({ bootcamp: request.params.bootcampId });
		} else {
			query = Course.find().populate({
				path: "bootcamp",
				select: "name description",
			});
		}

		const courses = await query;

		response.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	}

	// @desc Get single course
	// @route GET /api/v1/courses/:id
	// @access Public
	public async getCourse(request: Request, response: Response, next: NextFunction) {
		const course = await Course.findById(request.params.id).populate({
			path: "bootcamp",
			select: "name description",
		});

		if (!course) {
			return next(new ErrorResponse(`No course with the id of ${request.params.id}`, 404));
		}

		response.status(200).json({
			success: true,
			data: course,
		});
	}

	// @desc Add course
	// @route POST /api/v1/bootcamps/:bootcampId/courses
	// @access Private
	public async addCourse(request: Request, response: Response, next: NextFunction) {
		request.body.bootcamp = request.params.bootcampId;

		const bootcamp = await Bootcamp.findById(request.params.bootcampId);

		if (!bootcamp) {
			return next(
				new ErrorResponse(`No bootcamp with the id of ${request.params.bootcampId}`, 404)
			);
		}

		const course = await Course.create(request.body);

		response.status(200).json({
			success: true,
			data: course,
		});
	}

	// @desc Update course
	// @route PUT /api/v1/courses/:id
	// @access Private
	public async updateCourse(request: Request, response: Response, next: NextFunction) {
		let course = await Course.findById(request.params.id);

		if (!course) {
			return next(new ErrorResponse(`No course found with the id of ${request.params.id}`, 404));
		}

		course = await Course.findByIdAndUpdate(request.params.id, request.body, {
			new: true,
			runValidators: true,
		});

		response.status(200).json({
			success: true,
			data: course,
		});
	}

	// @desc Delete course
	// @route DELETE /api/v1/courses/:id
	// @access Private
	public async deleteCourse(request: Request, response: Response, next: NextFunction) {
		const course = await Course.findById(request.params.id);

		if (!course) {
			return next(new ErrorResponse(`No course found with the id of ${request.params.id}`, 404));
		}

		await course.remove();

		response.status(200).json({
			success: true,
			data: {},
		});
	}
}

export default CoursesController;
