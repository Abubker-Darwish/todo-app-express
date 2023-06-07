import { user } from '@prisma/client';
import { Request } from 'express';

export type GlobalFiltersType = {
  search?: string;
  rpp?: string;
  page?: string;
  sort?: string;
};

export type Pagination = {
  rpp: number;
  currentPage: number;
  nextPage: number;
  totalPages: number;
};

export type UserRequest = Request & {
  user?: user | null;
};
