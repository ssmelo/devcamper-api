import { Router } from 'express'
import { BootcampsController } from '../controllers/BootcampsController';
import asyncHandler from '../middleware/async';

const router = Router();

const bootcampsController = new BootcampsController();

router.route('/radius/:zipcode/:distance').get(bootcampsController.getBootcampsInRadius);

router.route('/')
    .get(asyncHandler(bootcampsController.getBootcamps))
    .post(asyncHandler(bootcampsController.createBootcamp));

router.route('/:id')
    .get(asyncHandler(bootcampsController.getBootcamp))
    .put(asyncHandler(bootcampsController.updateBootcamp))
    .delete(asyncHandler(bootcampsController.deleteBootcamp));

export default router;