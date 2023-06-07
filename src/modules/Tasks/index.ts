import express from 'express';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getSingleTask,
  updateTask,
} from './tasks.controller';
import { authorizationMiddleware } from '@/middleware';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// ? middleware
router.use(authorizationMiddleware);

router.route('/').get(asyncHandler(getAllTasks)).post(asyncHandler(createTask));

router
  .route('/:id')
  .get(asyncHandler(getSingleTask))
  .delete(asyncHandler(deleteTask))
  .put(asyncHandler(updateTask));

export default router;
