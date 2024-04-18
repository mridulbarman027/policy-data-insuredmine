/* eslint-disable no-unused-vars */
import boom from '@hapi/boom';
import { ZodError } from 'zod';

const errorHandler = (err, req, res, next) => {
  const isZodError = err instanceof ZodError;
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev && isZodError) {
    res.status(400).json({ error: err.issues });
    return;
  }
  if (isZodError) {
    if (req.method === 'POST') {
      res.status(400).json({
        error: {
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid payload',
        },
      });
      return;
    }
    res.status(400).json({
      error: {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid query parameters',
      },
    });
    return;
  }
  const {
    output: { payload: error, statusCode },
  } = boom.boomify(err);

  res.status(statusCode).json({ error });
  if (statusCode >= 500) {
    console.log(err);
  }
};

export default errorHandler;
