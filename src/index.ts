import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import requestIp from 'request-ip';

import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import api from './routes';
import { validateEnvironmentVariables } from './util/envValidator';

const PORT = process.env.PORT || 8080;

const cronEnabled = process.env.CRON_ENABLED === 'true' || false;

// mongoose.connect('mongodb://localhost:27017/your_database');
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

const app = express();

app.use(requestIp.mw());

//* Middilewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api', api);

//* Start the server
app.listen(PORT, () => {
  try {
    console.log('Checking environment variables');
    validateEnvironmentVariables();
    console.log(`Listening at http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);
