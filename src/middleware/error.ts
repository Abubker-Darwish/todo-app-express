import variables from '@/variables';
import colors from 'colors';
import { NextFunction, Request, Response } from 'express';

export const errorLogger = (
  error: Error,
  _request: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line no-console
  console.log(colors.red(`error ${error?.message}`));

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: error.message,
    stack: variables.env === 'development' ? error.stack : '',
  });
  next(error);
};
