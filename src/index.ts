/* eslint-disable unicorn/prefer-top-level-await */
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import requestIp from 'request-ip';

import connectMongo from './config/mongodb';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import api from './routes';
import { validateEnvironmentVariables } from './util/envValidator';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(requestIp.mw());

//* Middilewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api', api);

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      try {
        console.log('Checking environment variables');
        validateEnvironmentVariables();
        console.log(`Listening at http://localhost:${PORT}`);
      } catch (error) {
        console.log(error);
      }
    });
  })
  .catch(error => {
    console.log(error);
  });

app.use(notFoundHandler);
app.use(errorHandler);
