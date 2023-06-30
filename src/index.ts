import morgan from 'morgan';
import variables from './variables';
import express from 'express';
import colors from 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// ? routers
import userRoute from '@/modules/Users';
import taskRoute from '@/modules/Tasks';
import authenticationRoute from '@/modules/Authentication';

import { errorLogger } from './middleware';
// ? init app
const app = express();

// ? app middleware
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status'));

// ? root route
app.get('/api', (_, res) => {
  res.status(200).json({ status: 'server is working smoothly' });
});

// * routes
app.use('/api/v1', authenticationRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tasks', taskRoute);

app.use('*', (_req, res) => {
  return res.status(404).json({ message: 'Not Found Route' });
});

app.use(errorLogger);

app.listen(variables.port, () => {
  // eslint-disable-next-line no-console
  console.log(colors.cyan(`app listening on port :${variables.port}`));
});
