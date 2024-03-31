import express from 'express';
import { anonymousRoute } from './anonymousRoute';
import { userRoute } from './userRoute';
import { uiRoute } from './uiRoute';
import { roleRoute } from './roleRoute';

export const routes = express.Router();

routes.use(anonymousRoute);
routes.use(userRoute);
routes.use(uiRoute);
routes.use(roleRoute);