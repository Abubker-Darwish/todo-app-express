import express, { Response } from 'express';
import {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
} from './users.controller';
import { authorizationMiddleware } from '@/middleware';
import asyncHandler from 'express-async-handler';
import { UserRequest } from '@/types';

const router = express.Router();

// ? middleware
router.use(authorizationMiddleware);
router.use((req: UserRequest, res: Response, next) => {
  if (req.user?.role === 'basic') {
    res.status(401);
    throw Error('you are not allowed');
  }
  next();
});

router.route('/').get(asyncHandler(getAllUsers)).post(asyncHandler(createUser));
router
  .route('/:id')
  .get(asyncHandler(getSingleUser))
  .delete(asyncHandler(deleteUser))
  .put(asyncHandler(updateUser));

export default router;
