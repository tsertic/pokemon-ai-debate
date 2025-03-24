/**
 * Claude Controller
 * Handles HTTP requests for Claude API endpoints
 */
import {
  generateDebateResponse,
  getAvailableModels,
} from "../services/claude-service.js";
import logger from "../utils/logger.js"; // Changed to default import
/**
 * Generate a response from Claude for the Pokémon debate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const generateResponse = async (req, res, next) => {
  try {
    const { messages, pokemonB } = req.body;

    // Validate request body
    if (!pokemonB) {
      return res.status(400).json({
        error: "Missing required parameter: pokemonB",
      });
    }

    logger.info(`Generating Claude response for Pokémon: ${pokemonB}`);

    // Call service to generate response
    const response = await generateDebateResponse(messages, pokemonB);

    logger.info("Claude response generated successfully");
    return res.json(response);
  } catch (error) {
    logger.error(`Error generating Claude response: ${error.message}`);
    next(error);
  }
};

/**
 * Get available Claude models
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getModels = async (req, res, next) => {
  try {
    logger.info("Fetching available Claude models");

    const models = await getAvailableModels();

    logger.info(`Retrieved ${models.length} Claude models`);
    return res.json(models);
  } catch (error) {
    logger.error(`Error fetching Claude models: ${error.message}`);
    next(error);
  }
};

export default {
  generateResponse,
  getModels,
};
