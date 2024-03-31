import { Request, Response, Router } from 'express';

export const anonymousRoute = Router();

anonymousRoute.get('/contactUs', (req:Request, res:Response) => {
  res.json({data:"What's up doc ?!"});
});