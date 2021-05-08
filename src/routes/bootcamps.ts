import { Router } from 'express'
import { BootcampsController } from '../controllers/BootcampsController';
import asyncHandler from '../middleware/async';

// Include other resource routers
import courseRouter from './courses';

const router = Router();

const bootcampsController = new BootcampsController();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(bootcampsController.getBootcampsInRadius);

router.route('/')
    .get(asyncHandler(bootcampsController.getBootcamps))
    .post(asyncHandler(bootcampsController.createBootcamp));

router.route('/:id')
    .get(asyncHandler(bootcampsController.getBootcamp))
    .put(asyncHandler(bootcampsController.updateBootcamp))
    .delete(asyncHandler(bootcampsController.deleteBootcamp));

export default router;