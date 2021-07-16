import { Request, Response } from 'express';

export default (fn: any) => (req: Request, res: Response) => {
  Promise.resolve(fn(req, res)).catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
};
