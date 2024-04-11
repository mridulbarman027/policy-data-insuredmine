/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { Worker } from 'worker_threads';

export const uploadContoller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      next(boom.badRequest('Invalid Payload'));
      return;
    }

    const csvFilePath = req.file.path;

    const workerRes = new Worker('./src/workers/csv.ts', { workerData: { csvFilePath } });

    workerRes.on('message', message => {
      res.send({ data: message });
    });

    // Listen for errors from the worker thread
    workerRes.on('error', error => {
      console.error('Worker error:', error);
      res.status(500).send('Internal Server Error');
    });
  } catch (error) {
    next(error);
  }
};
