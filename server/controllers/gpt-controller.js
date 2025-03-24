/**
 * GPT Controller
 * Handles HTTP requests for GPT API endpoints
 */
import {
  generateDebateResponse,
  getAvailableModels,
} from "../services/gpt-service.js";
import { formatError } from "../utils/error-handler.js";
import logger from "../utils/logger.js"; // Changed to default import

/**
 * Generate a response from GPT for the Pokémon debate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const generateResponse = async (req, res, next) => {
  try {
    const { messages, pokemonA } = req.body;

    // Validate request body
    if (!pokemonA) {
      return res.status(400).json({
        error: "Missing required parameter: pokemonA",
      });
    }

    logger.info(`Generating GPT response for Pokémon: ${pokemonA}`);

    // Call service to generate response
    const response = await {
      generateDebateResponse,
      getAvailableModels,
    }.generateDebateResponse(messages, pokemonA);

    logger.info("GPT response generated successfully");
    return res.json(response);
  } catch (error) {
    logger.error(`Error generating GPT response: ${error.message}`);
    next(error);
  }
};

/**
 * Get available GPT models
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getModels = async (req, res, next) => {
  try {
    logger.info("Fetching available GPT models");

    const models = await gptService.getAvailableModels();

    logger.info(`Retrieved ${models.length} GPT models`);
    return res.json(models);
  } catch (error) {
    logger.error(`Error fetching GPT models: ${error.message}`);
    next(error);
  }
};

export { generateResponse, getModels };
