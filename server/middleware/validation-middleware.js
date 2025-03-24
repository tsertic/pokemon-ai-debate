/**
 * Request validation middleware
 * Validates incoming request data
 */
import { warn } from "../utils/logger.js";

/**
 * Validate GPT API request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateGptRequest = (req, res, next) => {
  const { pokemonA } = req.body;

  if (!pokemonA) {
    warn("Invalid GPT request: missing pokemonA", { body: req.body });
    return res.status(400).json({
      statusCode: 400,
      message: "Missing required parameter: pokemonA",
    });
  }

  next();
};

/**
 * Validate Claude API request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateClaudeRequest = (req, res, next) => {
  const { pokemonB } = req.body;

  if (!pokemonB) {
    warn("Invalid Claude request: missing pokemonB", { body: req.body });
    return res.status(400).json({
      statusCode: 400,
      message: "Missing required parameter: pokemonB",
    });
  }

  next();
};

/**
 * Validate Gemini API request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateGeminiRequest = (req, res, next) => {
  const { gptMessages, claudeMessages, pokemonA, pokemonB } = req.body;

  const missingParams = [];
  if (!gptMessages) missingParams.push("gptMessages");
  if (!claudeMessages) missingParams.push("claudeMessages");
  if (!pokemonA) missingParams.push("pokemonA");
  if (!pokemonB) missingParams.push("pokemonB");

  if (missingParams.length > 0) {
    warn(
      `Invalid Gemini request: missing parameters: ${missingParams.join(", ")}`,
      { body: req.body }
    );
    return res.status(400).json({
      statusCode: 400,
      message: `Missing required parameter(s): ${missingParams.join(", ")}`,
    });
  }

  next();
};

/**
 * Rate limiting middleware
 * @param {Number} limit - Requests per minute
 * @returns {Function} Rate limiting middleware
 */
const rateLimit = (limit = 50) => {
  const requestCounts = new Map();

  return (req, res, next) => {
    const clientIP = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const currentMinute = Math.floor(Date.now() / 60000);
    const key = `${clientIP}-${currentMinute}`;

    const currentCount = requestCounts.get(key) || 0;

    if (currentCount >= limit) {
      warn(`Rate limit exceeded for ${clientIP}`, {
        count: currentCount,
        limit,
      });
      return res.status(429).json({
        statusCode: 429,
        message: "Too many requests, please try again later",
      });
    }

    requestCounts.set(key, currentCount + 1);

    // Clean up old entries
    for (const [mapKey] of requestCounts) {
      const [, minute] = mapKey.split("-");
      if (parseInt(minute) < currentMinute) {
        requestCounts.delete(mapKey);
      }
    }

    next();
  };
};

export default {
  validateGptRequest,
  validateClaudeRequest,
  validateGeminiRequest,
  rateLimit,
};
