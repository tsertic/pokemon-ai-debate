/**
 * Utilities for formatting messages for different AI services
 */

/**
 * Format messages for OpenAI GPT API
 * @param {Array} messages - Debate messages array
 * @param {string} systemMessage - System message to include
 * @returns {Array} Formatted messages for GPT
 */
export const formatForGPT = (messages = [], systemMessage) => {
  // Initialize with system message
  const formattedMessages = [{ role: "system", content: systemMessage }];

  if (messages && messages.length > 0) {
    // Convert debate messages to OpenAI format
    messages.forEach((msg) => {
      if (msg.role === "GPT") {
        formattedMessages.push({ role: "assistant", content: msg.content });
      } else if (msg.role === "CLAUDE") {
        formattedMessages.push({ role: "user", content: msg.content });
      }
    });
  }

  return formattedMessages;
};

/**
 * Format messages for Anthropic Claude API
 * @param {Array} messages - Debate messages array
 * @returns {Array} Formatted messages for Claude
 */
export const formatForClaude = (messages = []) => {
  if (!messages || messages.length === 0) {
    return [];
  }

  // Convert debate messages to Claude format
  return messages
    .map((msg) => {
      if (msg.role === "GPT") {
        return { role: "user", content: msg.content };
      } else if (msg.role === "CLAUDE") {
        return { role: "assistant", content: msg.content };
      }
      return null;
    })
    .filter(Boolean); // Remove any null entries
};

/**
 * Extract message content for specific roles
 * @param {Array} messages - Debate messages array
 * @param {string} role - Role to extract ('GPT' or 'CLAUDE')
 * @returns {Array} Array of message contents
 */
export const extractMessageContent = (messages = [], role) => {
  if (!messages || !Array.isArray(messages)) {
    return [];
  }

  return messages.filter((msg) => msg.role === role).map((msg) => msg.content);
};

export default {
  formatForGPT,
  formatForClaude,
  extractMessageContent,
};
