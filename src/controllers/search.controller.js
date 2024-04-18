/* eslint-disable no-underscore-dangle */
import boom from '@hapi/boom';

import { PolicyInfoModel, UserModel } from '../models/index.js';

export const searchContoller = async (req, res, next) => {
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
