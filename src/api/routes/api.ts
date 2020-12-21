import express from 'express';
import { DatabaseAdapter } from '../../dataproviders/database-adapter';

import { articleRouter } from './article';
import { customerRouter } from './customer';
import { actionRouter } from './action';

const db = new DatabaseAdapter();

const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.json({ status: 'API is Working' });
});

apiRouter.use('/article', articleRouter(db));
apiRouter.use('/customer', customerRouter(db));
apiRouter.use('/action', actionRouter(db));

export default apiRouter;
