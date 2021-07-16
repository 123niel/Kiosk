import express, { Request, Response } from 'express';
import { DatabaseAdapter } from '../../dataproviders/database-adapter';
import { ExcelAdapter } from '../../dataproviders/excel';

import catchAsync from '../middleware/catchAsync';

export const excelRouter = (db: DatabaseAdapter) => {
  const router = express.Router();
  const excelAdapter = new ExcelAdapter(db);

  router.get('/export', catchAsync(async (req: Request, res: Response) => {
    const result = await excelAdapter.save();
    res.send();
  }));

  router.get('/import', catchAsync(async (req: Request, res: Response) => {
    const result = await excelAdapter.load();
    res.send(result);
  }));
  return router;
};
