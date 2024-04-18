/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/prefer-top-level-await */
import { exec } from 'child_process';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import os from 'os';
import requestIp from 'request-ip';
import 'dotenv/config';

import connectMongo from './config/mongodb.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import notFoundHandler from './middlewares/notFoundHandler.middleware.js';
import api from './routes/index.js';

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

let previousCPUUsage;
let serverProcess;

const startServer = () => {
  console.log('Starting server...');
  // We can use pm2 config for prod
  serverProcess = exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error('Error starting server:', error);
    } else {
      console.log('Server restarted successfully.');
    }
  });
};

const stopServer = () => {
  if (serverProcess) {
    console.log('Stopping server...');
    serverProcess.kill('SIGINT');
    serverProcess = null;
  }
};

const trackCPUUsage = () => {
  const currentCPUUsage = os.cpus();

  if (previousCPUUsage) {
    const idleDifference = currentCPUUsage.reduce((acc, cpu, index) => {
      const previousCPUTime = previousCPUUsage[index].times;
      return acc + (cpu.times.idle - previousCPUTime.idle);
    }, 0);

    const totalDifference = currentCPUUsage.reduce((acc, cpu, index) => {
      const previousCPUTime = previousCPUUsage[index].times;
      return (
        acc +
        (cpu.times.user +
          cpu.times.nice +
          cpu.times.sys +
          cpu.times.idle -
          (previousCPUTime.user + previousCPUTime.nice + previousCPUTime.sys + previousCPUTime.idle))
      );
    }, 0);

    const cpuUsage = ((totalDifference - idleDifference) / totalDifference) * 100;

    console.log('Current CPU usage:', `${cpuUsage.toFixed(2)}%`);

    if (cpuUsage >= 70) {
      stopServer();
      startServer();
    }
  }

  previousCPUUsage = currentCPUUsage;
};

const interval = setInterval(trackCPUUsage, 1000);
