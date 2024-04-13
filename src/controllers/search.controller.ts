/* eslint-disable no-underscore-dangle */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { PolicyInfoModel, UserModel } from '../models';

export const searchContoller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.params.username) {
      next(boom.badRequest('Invalid username'));
      return;
    }

    const user = await UserModel.findOne({ firstname: req.params.username });

    if (!user) {
      next(boom.badRequest('User not found'));
      return;
    }

    const policyInfo = await PolicyInfoModel.find({ user_id: user._id });

    if (!policyInfo) {
      next(boom.badRequest('Policy not found for the selected user'));
      return;
    }

    res.send({ user, policy: policyInfo });
  } catch (error) {
    next(error);
  }
};
