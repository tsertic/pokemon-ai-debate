/**
 * GPT Service
 * Handles interactions with OpenAI API
 */
import OpenAI from "openai";
import config from "../config/ai-config.js";
import logger from "../utils/logger.js";
import { formatForGPT } from "../utils/message-formatter.js";
import { handleAPIError } from "../utils/error-handler.js";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

/**
 * Generate a debate response from GPT
 * @param {Array} messages - Previous messages in the debate
 * @param {string} pokemonName - Name of the Pokémon to defend
 * @returns {string} GPT's response
 */
export const generateDebateResponse = async (messages = [], pokemonName) => {
  try {
    logger.debug(`Generating GPT response for ${pokemonName}`, {
      messagesCount: messages?.length || 0,
    });

    const systemMessage = config.openai.systemMessageTemplate(pokemonName);
    const formattedMessages = formatForGPT(messages, systemMessage);

    logger.debug("Formatted messages for GPT", {
      messageCount: formattedMessages.length,
      firstSystem: formattedMessages[0]?.content.substring(0, 50) + "...",
    });

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: formattedMessages,
      max_tokens: config.openai.max_tokens,
      temperature: config.openai.temperature,
    });

    const response = completion.choices[0]?.message?.content || "";
    logger.debug("Received GPT response", { length: response.length });

    return response;
  } catch (error) {
    logger.error(`Error generating GPT response: ${error.message}`, { error });
    throw error;
  }
};

/**
 * Get available GPT models
 * @returns {Array} List of available models
 */
export const getAvailableModels = async () => {
  try {
    logger.debug("Fetching available GPT models");

    const response = await openai.models.list();

    // Filter for chat models and sort by newest first
    const chatModels = response.data
      .filter((model) => model.id.includes("gpt"))
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    logger.debug(`Retrieved ${chatModels.length} GPT models`);
    return chatModels.map((model) => ({
      id: model.id,
      created: model.created,
      owned_by: model.owned_by,
    }));
  } catch (error) {
    logger.error(`Error fetching GPT models: ${error.message}`, { error });
    throw error;
  }
};

export default { generateDebateResponse, getAvailableModels };
