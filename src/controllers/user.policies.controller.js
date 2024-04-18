import { UserModel } from '../models/index.js';

export const userPoliciesContoller = async (req, res, next) => {
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
