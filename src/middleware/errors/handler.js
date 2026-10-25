import { AppError } from "./custom.js";

const errorHandler = async (err, req, res, next) => {
  // errors of my custom App instance
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  // for unknown errors
  console.log("Error Message: ", err.message);
  console.log("Error Stack: ", err.stack);
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
};

export default errorHandler;
