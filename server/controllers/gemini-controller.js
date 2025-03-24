/**
 * Gemini Controller
 * Handles HTTP requests for Gemini API endpoints
 */
import {
  generateDebateVerdict,
  getAvailableModels,
} from "../services/gemini-service.js";
import logger from "../utils/logger.js"; // Changed to default import
/**
 * Generate a verdict from Gemini for the Pokémon debate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const generateVerdict = async (req, res, next) => {
  try {
    const { gptMessages, claudeMessages, pokemonA, pokemonB } = req.body;

    // Validate request body
    if (!gptMessages || !claudeMessages || !pokemonA || !pokemonB) {
      return res.status(400).json({
        error:
          "Missing required parameters: gptMessages, claudeMessages, pokemonA, or pokemonB",
      });
    }

    logger.info(
      `Generating Gemini verdict for debate between ${pokemonA} and ${pokemonB}`
    );

    // Call service to generate verdict
    const verdict = await generateDebateVerdict(
      gptMessages,
      claudeMessages,
      pokemonA,
      pokemonB
    );

    logger.info("Gemini verdict generated successfully");
    return res.json(verdict);
  } catch (error) {
    logger.error(`Error generating Gemini verdict: ${error.message}`);
    next(error);
  }
};

/**
 * Get available Gemini models
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getModels = async (req, res, next) => {
  try {
    logger.info("Fetching available Gemini models");

    const models = await getAvailableModels();

    logger.info(`Retrieved ${models.length} Gemini models`);
    return res.json(models);
  } catch (error) {
    logger.error(`Error fetching Gemini models: ${error.message}`);
    next(error);
  }
};

export default {
  generateVerdict,
  getModels,
};
