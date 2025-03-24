/**
 * Error handling middleware
 * Provides centralized error handling for Express
 */
import { formatError } from "../utils/error-handler.js";
import logger from "../utils/logger.js";

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error processing ${req.method} ${req.path}: ${err.message}`, {
    error: err,
    body: req.body,
    params: req.params,
    query: req.query,
    url: req.originalUrl,
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Format the error based on environment
  const errorResponse = formatError(err, statusCode);

  // Send formatted error as response
  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFoundHandler = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    statusCode: 404,
    message: "Resource not found",
    path: req.originalUrl,
  });
};

export { errorHandler, notFoundHandler };
