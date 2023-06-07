import express from 'express';
import { login, signup, currentEmployee } from './authentication.controller';
import asyncHandler from 'express-async-handler';
import { authorizationMiddleware } from '@/middleware';

const router = express.Router();

router.route('/login').post(asyncHandler(login));

router.route('/signup').post(asyncHandler(signup));
router
  .route('/current_employee')
  .get(authorizationMiddleware, asyncHandler(currentEmployee));

export default router;
