import jwt, { IDJwtPayload } from 'jsonwebtoken';
import variables from '../variables';
import { NextFunction, Request, Response } from 'express';
import prisma from '@/services/prismaClient';
import { user } from '@prisma/client';
import { omit } from 'ramda';

type UserRequest = Request & {
  user?: user | null;
};

const authorizationMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  // ? verify auth via headers
  // * const { authorization } = req.headers;
  // * const token = authorization?.split(' ')[1];

  // ? verify auth via cookies
  const { auth_token } = req.cookies as { auth_token: string };
  if (!auth_token)
    return res.status(401).json({ message: 'Authorization token required' });

  try {
    // ? verify the user token
    const payload = jwt.verify(auth_token, variables.secret) as IDJwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: Number(payload?.id) },
    });

    const rest = omit(['password'], user ?? {});
    req.user = rest as user;
    next();
  } catch (e) {
    res.status(401).json({ message: 'user is not authorized' });
  }
};
export default authorizationMiddleware;
