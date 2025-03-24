/* 
Error handling utilities
*/
import logger from "./logger.js";
import env from "./../config/env.js";

/* 
    Format error for consistent API responses
    @params {Error} error- The error object
    @params {number} statusCode-HTTP status code
    @returns {object} formatted error object
*/
const formatError = (error, statusCode = 500) => {
  //extract useful logger.info
  if (error.response) {
    //error from external API
    return {
      statusCode: statusCode,
      message: error.message || "External API error",
      details: error.response.data || {},
      source: error.response.config?.url || "external API",
    };
  } else {
    //standard error
    return {
      statusCode: statusCode,
      message: error.message || "Internal server error",
      details: error.details || {},
      stack: env.nodeEnv === "development" ? error.stack : undefined,
    };
  }
};

/**
 * Handle API-specific errors
 * @param {Error} error - Error object from API
 * @returns {Object} Formatted error with appropriate status code
 */
const handleAPIError = (error) => {
  // Default status code
  let statusCode = 500;

  // Check for known error patterns from different AI APIs

  // OpenAI specific errors
  if (error.response?.status === 401) {
    statusCode = 401; // Unauthorized
  } else if (error.response?.status === 429) {
    statusCode = 429; // Rate limit exceeded
  } else if (error.code === "context_length_exceeded") {
    statusCode = 413; // Payload too large
  }

  // Anthropic specific errors
  else if (error.message?.includes("authentication")) {
    statusCode = 401; // Unauthorized
  } else if (error.message?.includes("rate limit")) {
    statusCode = 429; // Rate limit exceeded
  }

  // Google Gemini specific errors
  else if (error.message?.includes("API key")) {
    statusCode = 401; // Unauthorized
  } else if (error.message?.includes("quota")) {
    statusCode = 429; // Rate limit exceeded
  }

  logger.error(`API Error: ${error.message}`, { statusCode });
  return formatError(error, statusCode);
};

// Change from CommonJS exports to ES module exports
export { formatError, handleAPIError };
