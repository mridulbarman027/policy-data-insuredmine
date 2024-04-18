import boom from '@hapi/boom';

const notFoundHandler = (req, res, next) => {
  next(boom.notFound('The requested resource does not exist.'));
};

export default notFoundHandler;
