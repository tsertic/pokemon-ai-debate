/**
 * Gemini Service
 * Handles interactions with Google AI Gemini API
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gemini } from "../config/ai-config.js";
import logger from "../utils/logger.js";

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(gemini.apiKey);
const model = genAI.getGenerativeModel({ model: gemini.model });

/**
 * Generate a verdict for the debate from Gemini
 * @param {Array} gptMessages - Messages from GPT (for Pokémon A)
 * @param {Array} claudeMessages - Messages from Claude (for Pokémon B)
 * @param {string} pokemonA - Name of first Pokémon
 * @param {string} pokemonB - Name of second Pokémon
 * @returns {string} Gemini's verdict
 */
export const generateDebateVerdict = async (
  gptMessages,
  claudeMessages,
  pokemonA,
  pokemonB
) => {
  try {
    logger.debug(`Generating Gemini verdict for ${pokemonA} vs ${pokemonB}`, {
      gptMessagesCount: gptMessages?.length || 0,
      claudeMessagesCount: claudeMessages?.length || 0,
    });

    const prompt = gemini.systemMessageTemplate(
      pokemonA,
      pokemonB,
      gptMessages,
      claudeMessages
    );

    logger.debug("Sending prompt to Gemini");

    const chatSession = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: gemini.maxOutputTokens,
      },
    });

    const result = await chatSession.sendMessage(prompt);
    const verdict = result.response.text();

    logger.debug("Received Gemini verdict", { length: verdict.length });
    return verdict;
  } catch (error) {
    logger.error(`Error generating Gemini verdict: ${error.message}`, {
      error,
    });
    throw error;
  }
};

/**
 * Get available Gemini models
 * @returns {Array} List of available models
 */
export const getAvailableModels = async () => {
  try {
    logger.debug("Returning available Gemini models");

    // Google doesn't have a models.list() endpoint yet, so we return our configured models
    const models = [
      { id: gemini.model, isDefault: true },
      ...Object.entries(gemini.alternative_models).map(([key, id]) => ({
        id,
        type: key,
        isDefault: false,
      })),
    ];

    logger.debug(`Returned ${models.length} Gemini models`);
    return models;
  } catch (error) {
    logger.error(`Error getting Gemini models: ${error.message}`, { error });
    throw error;
  }
};

export default {
  generateDebateVerdict,
  getAvailableModels,
};
