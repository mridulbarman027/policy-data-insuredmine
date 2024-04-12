/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import csv from 'csv-parser';
import fs from 'fs';
import mongoose from 'mongoose';
import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';

import { AgentModel } from '../models';

const { csvFilePath } = workerData;

const results: any = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', async data => {
    try {
      //

      // const user = new User({
      //   firstName: data.firstname,
      //   dob: new Date(data.dob),
      //   address: data.address,
      //   phone: data.phone,
      //   state: data.state,
      //   zip: data.zip,
      //   email: data.email,
      //   gender: data.gender,
      //   userType: data.userType,
      // });
      // await user.save();

      // results.push('Data saved successfully');
      results.push(data);
    } catch (error) {
      console.log(error);
      results.push(`Error saving data: ${error}`);
    }
  })
  .on('end', () => {
    if (parentPort) parentPort.postMessage(results);
  });
