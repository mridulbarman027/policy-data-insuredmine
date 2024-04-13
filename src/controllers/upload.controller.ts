/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-unused-collection */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-empty-collection */
/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { Worker } from 'worker_threads';

import { AgentModel, PolicyCarrierModel, PolicyCategoryModel } from '../models';

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
      workerRes.terminate();

      const uniqueAgents = new Set();
      const uniquepolicyCategories = new Set();
      const uniquepolicyCarriers = new Set();
      const uniquepolicyInfos = new Set();

      const agents: any = [];
      const users: any = [];
      const userAccounts: any = [];
      const policyCategories: any = [];
      const policyCarriers: any = [];
      const policyInfos: any = [];

      result.forEach(async (item: any) => {
        const {
          agent,
          firstname,
          dob,
          address,
          phone,
          state,
          zip,
          email,
          gender,
          userType,
          account_name,
          category_name,
          company_name,
          policy_number,
          policy_start_date,
          policy_end_date,
          policy_category,
        } = item;

        policyCarriers.push({ company_name, category_name });
        policyCategories.push({ category_name });

        agents.push({ agent });
        users.push({ firstname, dob, address, phone, state, zip, email, gender, userType });
        userAccounts.push({ account_name });

        policyInfos.push({
          policy_number,
          policy_start_date,
          policy_end_date,
          policy_category,
        });
      });

      await new Promise<void>((resolve, reject) => {
        policyCategories.forEach(async (item: any, index: number) => {
          if (!uniquepolicyCategories.has(item.category_name)) {
            uniquepolicyCategories.add(item.category_name);

            const existingCategory = await PolicyCategoryModel.findOne({ category_name: item.category_name });

            if (!existingCategory) {
              const categoryModel = new PolicyCategoryModel({
                category_name: item.category_name,
              });
              await categoryModel.save();
            }
          }

          if (index === policyCarriers.length - 1) {
            resolve();
          }
        });
      });

      await new Promise<void>((resolve, reject) => {
        policyCarriers.forEach(async (item: any, index: number) => {
          if (!uniquepolicyCarriers.has(item.company_name)) {
            uniquepolicyCarriers.add(item.company_name);

            const existingCompany = await PolicyCarrierModel.findOne({ company_name: item.company_name });

            if (!existingCompany) {
              const existingCategory = await PolicyCategoryModel.findOne({ category_name: item.category_name });

              const companyModel = new PolicyCarrierModel({
                company_name: item.company_name,
                category_id: existingCategory?._id,
              });
              await companyModel.save();
            }
          }

          if (index === policyCarriers.length - 1) {
            resolve();
          }
        });
      });

      await new Promise<void>((resolve, reject) => {
        agents.forEach(async (item: any, index: number) => {
          if (!uniqueAgents.has(item.agent)) {
            uniqueAgents.add(item.agent);

            const existingAgent = await AgentModel.findOne({ agent: item.agent });

            if (!existingAgent) {
              const agentModel = new AgentModel({
                agent: item.agent,
              });
              await agentModel.save();
            }
          }

          if (index === policyCarriers.length - 1) {
            resolve();
          }
        });
      });

      res.send({ data: result });
    });
  } catch (error) {
    next(error);
  }
};
