class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} Not Found`, 404);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Invalid Request") {
    super(message, 400);
  }
}

export default {
  AppError,
  NotFoundError,
  BadRequestError,
};
