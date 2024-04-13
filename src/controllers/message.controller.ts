import boom from '@hapi/boom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { NextFunction, Request, Response } from 'express';

import { MessageModel } from '../models';
import { toBase64 } from '../util';

dayjs.extend(customParseFormat);
dayjs.locale('en');

export const messageContoller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { message, date, time } = req.body;

    if (!message || !date || !time) {
      next(boom.badRequest('Invalid data provided'));
      return;
    }

    if (!dayjs(date, 'DD/MM/YYYY').isValid()) {
      next(boom.badRequest('Invalid date'));
      return;
    }

    const [hours, minutes] = time.split(':');
    const isValidTime = /^\d{2}$/.test(hours) && /^\d{2}$/.test(minutes);

    if (!isValidTime) {
      next(boom.badRequest('Invalid time format'));
      return;
    }

    const scheduledAt = dayjs(`${date} ${time}`, 'DD/MM/YYYY HH:mm').toDate();

    const messageModelCheck = await MessageModel.findOne({ _id: toBase64(`${date}${time}`) });

    if (messageModelCheck) {
      messageModelCheck.message = message;
      await messageModelCheck.save();
    } else {
      const messageModel = new MessageModel({ _id: toBase64(`${date}${time}`), message, date_time: scheduledAt });

      await messageModel.save();
    }

    res.send({ message: 'Message saved successfully' });
  } catch (error) {
    next(error);
  }
};
