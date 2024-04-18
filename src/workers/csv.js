/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import csv from 'csv-parser';
import fs from 'fs';
import mongoose from 'mongoose';
import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';

const { csvFilePath } = workerData;

const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', async data => {
    try {
      results.push(data);
    } catch (error) {
      console.log(error);
      results.push(`Error saving data: ${error}`);
    }
  })
  .on('end', () => {
    if (parentPort) parentPort.postMessage(results);
  });
