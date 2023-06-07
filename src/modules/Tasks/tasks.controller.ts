import { handleErrMsg, pagination } from '@/services/global';
import prisma from '@/services/prismaClient';
import { UserRequest } from '@/types';
import { Response } from 'express';

type QueryParamsType = {
  sort: string;
  rpp: string;
  search: string;
  page: string;
  userId: string;
};

type CreateTaskPayload = {
  title: string;
  description: string;
  completed: boolean;
  user_id?: string;
};

// ? desc: list all tasks
// ? route: GET: /api/v1/tasks
// ? @access Private
export const getAllTasks = async (req: UserRequest, res: Response) => {
  const {
    rpp = '99999999',
    page = '1',
    sort = 'asc',
    search = '',
    userId,
  } = req.query as QueryParamsType;

  const count = await prisma.task.count({
    where: {
      title: { contains: search },
      userId: req.user?.role === 'basic' ? req.user.id : +userId || undefined,
    },
  });

  const tasks = await prisma.task.findMany({
    take: +rpp,
    skip: +page * +rpp - +rpp,
    orderBy: { id: sort === 'desc' ? 'desc' : 'asc' },
    where: {
      title: { contains: search },
      userId: req.user?.role === 'basic' ? req.user.id : +userId || undefined,
    },
  });

  const paginate = pagination({
    rpp: +rpp,
    page: +page,
    total: count,
  });

  res.status(200).json({
    result: tasks,
    pagination: paginate,
  });
};

// ? desc: list single task
// ? route: GET: /api/v1/tasks/:id
// ? @access Private
export const getSingleTask = async (req: UserRequest, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (req.user?.role === 'basic' && task?.userId !== req.user.id) {
    throw Error('Task Not Found');
  }

  res.status(200).json({ task });
};

// ? desc: create single task
// ? route: POST: /api/v1/tasks
// ? @access Private
export const createTask = async (req: UserRequest, res: Response) => {
  const data = req.body as { task: CreateTaskPayload };
  const isAdmin = req.user?.role === 'admin';
  const task = await prisma.task.create({
    data: {
      title: data.task.title,
      description: data.task.description,
      completed: Boolean(data.task.completed),
      userId: isAdmin
        ? Number(data.task.user_id || req.user?.id)
        : Number(req.user?.id),
    },
  });
  res.status(200).json({ task });
};

// ? desc: delete task
// ? route: DELETE: /api/v1/tasks/:id
// ? @access Private
export const deleteTask = async (req: UserRequest, res: Response) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    if (!task) throw new Error('Task not found');

    res.status(200).json({ task });
  } catch (e) {
    throw Error(handleErrMsg(e));
  }
};

// ? desc: update task
// ? route: PUT: /api/v1/tasks/:id
// ? @access Private
export const updateTask = async (req: UserRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body as { task: CreateTaskPayload };
  const userTask = data.task;

  const exist = await prisma.task.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!exist) throw Error('Task Not Fount');

  const isAdmin = req.user?.role === 'admin';

  const task = await prisma.task.update({
    where: {
      id: Number(id),
    },
    data: {
      title: userTask.title,
      description: userTask.description,
      completed: Boolean(userTask.completed),
      userId: isAdmin ? Number(userTask.user_id || exist.userId) : exist.userId,
    },
  });

  res.status(200).json({ task });
};
