import { Request, Response, Router } from 'express';

export const uiRoute = Router();

uiRoute.get('/web/login', (req:Request, res:Response) => {
  res.render('login.handlebars');
});