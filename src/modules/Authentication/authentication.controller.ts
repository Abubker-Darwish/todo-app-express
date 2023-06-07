import {
  comparePassword,
  createAccessToken,
  hashPassword,
} from '@/services/authorization';
import prisma from '@/services/prismaClient';
import { UserRequest } from '@/types';
import { Request, Response } from 'express';
import { omit } from 'ramda';

type LoginPayload = {
  email?: string;
  password?: string;
};

type SignupPayload = {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
};

// ? desc: user login
// ? route: POST: /api/v1/login
// ? @access Public
export const login = async (req: Request, res: Response) => {
  const data = req.body as LoginPayload;
  if (!data.email || !data.password) throw Error('some parameters are missing');

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw Error('Invalid email or password');

  const isMatched = await comparePassword(data.password, user.password);
  if (!isMatched) throw Error('Invalid email or password');

  const loggedInUser = omit(['password'], user);

  const accessToken = await createAccessToken(loggedInUser);
  if (!accessToken) throw Error('Something went wrong');

  res.status(200).json({
    message: 'done',
    data: {
      user: loggedInUser,
      token: accessToken,
    },
  });
};

// ? desc: user signup
// ? route: POST: /api/v1/signup
// ? @access Public
export const signup = async (req: Request, res: Response) => {
  const data = req.body as SignupPayload;
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (user) throw Error('user name already Taken');

  const hashed = await hashPassword(data.password);
  const createdUser = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      role: 'basic',
      password: hashed,
    },
  });

  const loggedInUser = omit(['password'], createdUser);

  const accessToken = await createAccessToken(loggedInUser);
  if (!accessToken) throw Error('Something went wrong');
  res.status(200).json({
    message: 'User Created successfully',
    data: {
      user: loggedInUser,
      token: accessToken,
    },
  });
};

// ? desc: user signup
// ? route: GET: /api/v1/current_employee
// ? @access Private
export const currentEmployee = (req: UserRequest, res: Response) => {
  res.status(200).json({
    employee: req.user,
  });
};
