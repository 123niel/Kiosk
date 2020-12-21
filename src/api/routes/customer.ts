import express, { Response, Request } from 'express';
import { DatabaseAdapter } from '../../dataproviders/database-adapter';

import catchAsync from '../middleware/catchAsync';

export const customerRouter = (db: DatabaseAdapter) => {
  const router = express.Router();

  // Get all
  router.get('/', catchAsync(async (req: Request, res: Response) => {
    const customers = db.getCustomers();
    res.json(customers);
  }));

  // Add new
  router.post('/', catchAsync(async (req: Request, res: Response) => {
    const customer = db.addCustomer(req.body);
    res.json(customer);
  }));

  // Get one by id
  router.get('/:id', catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const customer = db.getCustomerByID(id);
    res.json(customer);
  }));

  return router;
};
