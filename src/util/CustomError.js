class CustomError extends Error {
  status;

  constructor(message, status) {
    super(message);
    this.name = 'CustomError';
    this.status = status || 500;
  }
}

export default CustomError;
