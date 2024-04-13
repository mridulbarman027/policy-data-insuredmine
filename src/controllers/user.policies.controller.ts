import { NextFunction, Request, Response } from 'express';

import { UserModel } from '../models';

export const userPoliciesContoller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const aggregatedData = await UserModel.aggregate([
      {
        $lookup: {
          from: 'policyinfos',
          let: { userIdString: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$user_id', '$$userIdString'],
                },
              },
            },
          ],
          as: 'policies',
        },
      },
    ]);

    res.send(aggregatedData);
  } catch (error) {
    next(error);
  }
};
