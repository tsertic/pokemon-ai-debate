/**
 * Claude Service
 * Handles interactions with Anthropic API
 */
import Anthropic from "@anthropic-ai/sdk";
import { claude } from "../config/ai-config.js";
import logger from "../utils/logger.js"; // Changed to import the default export
import { formatForClaude } from "../utils/message-formatter.js";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: claude.apiKey,
});

/**
 * Generate a debate response from Claude
 * @param {Array} messages - Previous messages in the debate
 * @param {string} pokemonName - Name of the Pokémon to defend
 * @returns {string} Claude's response
 */
export const generateDebateResponse = async (messages = [], pokemonName) => {
  try {
    logger.debug(`Generating Claude response for ${pokemonName}`, {
      messagesCount: messages?.length || 0,
    });

    const systemMessage = claude.systemMessageTemplate(pokemonName);
    const formattedMessages = formatForClaude(messages);

    logger.debug("Formatted messages for Claude", {
      messageCount: formattedMessages.length,
    });

    // Handle empty messages array
    if (!formattedMessages || formattedMessages.length === 0) {
      // If no messages, just send an initial response
      const completion = await anthropic.messages.create({
        model: claude.model,
        system: systemMessage,
        messages: [
          {
            role: "user",
            content: `Let's start a debate. Tell me why ${pokemonName} is superior.`,
          },
        ],
        max_tokens: claude.max_tokens,
      });

      const textResponse = extractTextFromClaudeResponse(completion);
      logger.debug("Received initial Claude response", {
        length: textResponse.length,
      });

      return textResponse;
    }

    // Otherwise, use the full conversation history
    const completion = await anthropic.messages.create({
      model: claude.model,
      system: systemMessage,
      messages: formattedMessages,
      max_tokens: claude.max_tokens,
    });

    const textResponse = extractTextFromClaudeResponse(completion);
    logger.debug("Received Claude response", { length: textResponse.length });

    return textResponse;
  } catch (error) {
    logger.error(`Error generating Claude response: ${error.message}`, {
      error,
    });
    throw error;
  }
};

/**
 * Extract text content from Claude API response
 * @param {Object} completion - Claude API response
 * @returns {string} Extracted text
 */
const extractTextFromClaudeResponse = (completion) => {
  return completion.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join(" ");
};

/**
 * Get available Claude models
 * @returns {Array} List of available models
 */
export const getAvailableModels = async () => {
  try {
    logger.debug("Returning available Claude models");

    // Anthropic doesn't have a models.list() endpoint yet, so we return our configured models
    const models = [
      { id: claude.model, isDefault: true },
      ...Object.entries(claude.alternative_models).map(([key, id]) => ({
        id,
        type: key,
        isDefault: false,
      })),
    ];

    logger.debug(`Returned ${models.length} Claude models`);
    return models;
  } catch (error) {
    logger.error(`Error getting Claude models: ${error.message}`, { error });
    throw error;
  }
};

export default {
  generateDebateResponse,
  getAvailableModels,
};
