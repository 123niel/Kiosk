import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import apiRouter from './routes/api';

export class ExpressApp {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cors());

    this.app.use('/api', apiRouter);
  }

  public start(port: any) {
    this.app.listen(port, () =>
      console.log(`listening at port ${port}`)
    );
  }
}
