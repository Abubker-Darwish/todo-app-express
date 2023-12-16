import { hashPassword } from '@/services/authorization';
import { cloudinaryApp } from '@/services/cloudinary';
import { handleErrMsg, pagination } from '@/services/global';
import prisma from '@/services/prismaClient';
import { UserRequest } from '@/types';
import { Response } from 'express';
import { omit } from 'ramda';

type CreateUserPayload = {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
  password: string;
  role: 'admin' | 'basic';
};

type QueryParamsType = {
  sort: string;
  rpp: string;
  search: string;
  page: string;
};

// ? desc: Create new user
// ? route: POST: /api/v1/users
// ? @access Private
export const createUser = async (req: UserRequest, res: Response) => {
  const data = req.body as { employee: CreateUserPayload };
  const userPayload = data.employee;

  const hashed = await hashPassword(userPayload.password);

  const exist = await prisma.user.findFirst({
    where: {
      OR: [{ email: userPayload.email }, { username: userPayload.username }],
    },
  });

  if (exist) {
    res.status(400);
    throw Error('Employee already exist');
  }

  if (userPayload.avatar) {
    try {
      const res = await cloudinaryApp.uploader.upload(userPayload.avatar, {
        folder: 'users',
      });
      userPayload.avatar = res.url;
    } catch (e) {
      throw Error('please make sure of the format of avatar');
    }
  }

  const user = await prisma.user.create({
    data: {
      email: userPayload.email,
      first_name: userPayload.first_name,
      last_name: userPayload.last_name,
      username: userPayload.username,
      password: hashed,
      avatar: userPayload.avatar || null,
      role: userPayload.role,
    },
  });

  res.status(200).json({ user: omit(['password'], user) });
};

// ? desc: list all users
// ? route: GET: /api/v1/users
// ? @access Private
export const getAllUsers = async (req: UserRequest, res: Response) => {
  const {
    rpp = '99999999',
    page = '1',
    sort = 'asc',
    search = '',
  } = req.query as QueryParamsType;

  const count = await prisma.user.count({
    where: {
      OR: [
        { first_name: { contains: search } },
        { last_name: { contains: search } },
      ],
    },
  });

  const users = await prisma.user.findMany({
    take: +rpp,
    skip: +page * +rpp - +rpp,
    orderBy: { id: sort === 'desc' ? 'desc' : 'asc' },
    where: {
      OR: [
        { first_name: { contains: search } },
        { last_name: { contains: search } },
      ],
    },
    select: {
      password: false,
      email: true,
      createdAt: true,
      first_name: true,
      id: true,
      last_name: true,
      username: true,
      role: true,
      avatar: true,
      updatedAt: true,
    },
  });

  const paginate = pagination({
    rpp: +rpp,
    page: +page,
    total: count,
  });

  res.status(200).json({
    result: users,
    pagination: paginate,
  });
};

// ? desc: list single user
// ? route: GET: /api/v1/users/:id
// ? @access Private
export const getSingleUser = async (req: UserRequest, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!user) throw Error('User not found');
  const result = omit(['password'], user);
  res.status(200).json({ user: result });
};

// ? desc: update user
// ? route: PUT: /api/v1/users/:id
// ? @access Private
export const updateUser = async (req: UserRequest, res: Response) => {
  const data = req.body as { user: CreateUserPayload };
  const { id } = req.params;
  const userPayload = data.user;

  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      email: userPayload.email,
      first_name: userPayload.first_name,
      last_name: userPayload.last_name,
      username: userPayload.username,
      role: userPayload.role,
    },
  });

  res.status(200).json({ user: omit(['password'], user) });
};

// ? desc: delete user
// ? route: DELETE: /api/v1/users/:id
// ? @access Private
export const deleteUser = async (req: UserRequest, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.delete({
      where: { id: +id },
    });
    if (!user) throw new Error('User not found');
    const result = omit(['password'], user);

    res.status(200).json({ user: result });
  } catch (e) {
    const err = handleErrMsg(e);
    res.status(500).json({ message: err });
  }
};
