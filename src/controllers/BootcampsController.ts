import { NextFunction, Request, Response } from "express";
import { Bootcamp } from "../models/Bootcamp";
import asyncHandler from "../middleware/async"
import ErrorResponse from "../utils/ErrorResponse";
import geocoder from "../utils/Geocoder";


class BootcampsController {
    
    // @desc Get all bootcamps
    // @route GET /api/v1/bootcamps
    // @access Public
    async getBootcamps(request, response, next) {
        let query;

        // Copy req.query
        const reqQuery = { ...request.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
        
        // Select Fields
        if(request.query.select) {
            const fields = request.query.select.split(',').join(' ');

            query = query.select(fields);
        }

        // Sort
        if(request.query.sort) {
            const sortBy = request.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(request.query.page, 10) || 1;
        const limit = parseInt(request.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();
        
        query = query.skip(startIndex).limit(limit);

        // Executing query
        const bootcamps = await query;

        // Pagination result
        const pagination: any = {};

        if(endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        response.status(200).json({
            success: true,
            count: bootcamps.length,
            pagination,
            data: bootcamps
        });

    }

    // @desc Get single bootcamp
    // @route GET /api/v1/bootcamps/:id
    // @access Public
    async getBootcamp(request, response, next) {
        const bootcamp = await Bootcamp.findById(request.params.id);

        if(!bootcamp)
            return next(new ErrorResponse(`Bootcamp not found with id of ${request.params.id}`, 404));

        response.status(200).json({ success: true, data: bootcamp })
    }

    // @desc Create new bootcamp
    // @route POST /api/v1/bootcamps
    // @access Private
    async createBootcamp(request: Request, response: Response, next: NextFunction) {
        const bootcamp = await Bootcamp.create(request.body);

        response.status(201).json({
            success: true,
            data: bootcamp
        });        
    }

    // @desc Update bootcamp
    // @route PUT /api/v1/bootcamps/:id
    // @access Private
    async updateBootcamp(request: Request, response: Response, next: NextFunction) {
        const bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true
        });

        if(!bootcamp)
            return next(new ErrorResponse(`Bootcamp not found with id of ${request.params.id}`, 404));
        
        response.status(200).json({ success: true, data: bootcamp });        
    }
    
    // @desc Delete bootcamp
    // @route DELETE /api/v1/bootcamps/:id
    // @access Private
    async deleteBootcamp(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        // Get lat/lng from geocoder
        const bootcamp = await Bootcamp.findById(id);

        if(!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${request.params.id}`, 404));
        }

        bootcamp.remove();

        return response.status(200).json({
            success: true,
            data: {}
        });
    }
    // @desc Get bootcamps within a radius
    // @route GET /api/v1/bootcamps/radius/:zipcode/:distance
    // @access Private
    async getBootcampsInRadius(request: Request, response: Response, next: NextFunction) {
        const { zipcode, distance } = request.params;

        // Get lat/lng from geocoder
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        // Calc radius using radians
        // Divide dist by radius of Earth
        // Earth radius = 3,963 mi / 6,378 km
        const radius = Number(distance) / 6378;

        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius] } }
        });

        response.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })
        
    }
}

export { BootcampsController }