/**
 * Request logging middleware
 * Logs information about incoming HTTP requests
 */
import morgan from "morgan";
import logger from "../utils/logger.js";

// Custom Morgan token for request body
morgan.token("body", (req) => {
  // Don't log body for GET requests
  if (req.method === "GET") return "";

  // For other methods, log a sanitized version of the body
  const sanitizedBody = { ...req.body };

  // Remove sensitive fields
  if (sanitizedBody.messages) {
    sanitizedBody.messages = `[Array: ${sanitizedBody.messages.length} items]`;
  }

  return JSON.stringify(sanitizedBody);
});

// Define custom format
const logFormat =
  process.env.NODE_ENV === "production"
    ? ":remote-addr - :method :url :status :response-time ms - :res[content-length]"
    : ":method :url :status :response-time ms - :body";

/**
 * Request logger middleware using Morgan
 */
const requestLogger = morgan(logFormat, {
  stream: logger.stream,
  skip: (req, res) => {
    // Skip logging for health check endpoints in production
    if (process.env.NODE_ENV === "production" && req.path === "/api/health") {
      return true;
    }
    return false;
  },
});

/**
 * Request context middleware
 * Adds a unique request ID and timestamp to each request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requestContext = async (req, res, next) => {
  // Generate a request ID
  const { randomUUID } = await import("crypto");
  req.id = randomUUID();

  // Add timestamp
  req.timestamp = new Date().toISOString();

  // Add request ID to response headers
  res.setHeader("X-Request-ID", req.id);

  next();
};

export { requestLogger, requestContext };
