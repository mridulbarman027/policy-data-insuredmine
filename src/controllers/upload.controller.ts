/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { Worker } from 'worker_threads';

import { AgentModel } from '../models';

export const uploadContoller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      next(boom.badRequest('Invalid Payload'));
      return;
    }

    const csvFilePath = req.file.path;

    const workerRes = new Worker('./src/workers/csv.ts', { workerData: { csvFilePath } });

    let result: any = [];
    workerRes.on('message', message => {
      result = message;
    });

    workerRes.on('error', error => {
      console.error('Worker error:', error);
      res.status(500).send('Internal Server Error');
    });

    workerRes.on('exit', async message => {
      const agent = new AgentModel({ agent: 'data.agent' });
      const sss = await agent.save();

      res.send({ data: result });

      workerRes.terminate();
    });
  } catch (error) {
    next(error);
  }
};
