/* 
    AI service configuration
*/

import env from "./env.js";

//OPENAI (GPT) configuration

const openaiConfig = {
  apiKey: env.openaiApiKey,
  model: "gpt-4o-mini", //default
  alternative_models: {
    powerful: "o1-preview",
  },
  max_tokens: 500,
  temperature: 0.6,
  // Custom system message template for the Pokémon debate
  systemMessageTemplate: (pokemonName) =>
    `You are an AI debater who argues that ${pokemonName} is superior. You are a ruthless strategist who exploits every weakness in your opponent's argument, leaving no room for mercy. Your tactics are sharp, relentless, and designed to dominate. 2 sentences max.`,
};

//Anthropic (Claude) configuration

const claudeConfig = {
  apiKey: env.anthropicApiKey,
  model: "claude-3-haiku-20240307",
  alternative_models: {
    powerful: "claude-3-opus-20240229",
    balanced: "claude-3-sonnet-20240229",
  },
  max_tokens: 500,
  temperature: 0.8,
  //custom system message template
  systemMessageTemplate: (pokemonName) =>
    `You are an AI debater who argues that ${pokemonName} is superior. You are a fearless idealist who believes in fair play and honor, always standing by your convictions. Your unwavering faith in justice sometimes makes you overlook deception, but your heart is always in the fight.Respond with 3 sentences maximum.`,
};

//Google (Gemini) configuration

const geminiConfig = {
  apiKey: env.geminiApiKey,
  model: "gemini-1.5-flash",
  alternative_models: {
    powerful: "gemini-1.5-pro",
  },
  maxOutputTokens: 500,
  temperature: 0.5,
  systemMessageTemplate: (pokemonA, pokemonB, gptMessages, claudeMessages) => `
  You are a wise and ancient wizard, acting as a fair and impartial judge in a Pokémon debate.  
With deep knowledge and keen insight, you carefully listen to the arguments made by two debaters.  
Like a sage who sees beyond mere words, you evaluate their logic, reasoning, and evidence before rendering a final judgment on which Pokémon is truly superior.  
Your decision must be based on the debate, not personal bias and you always add a little humor to your judgment.  
Summarize the key points from both sides with the wisdom of an oracle and declare the winner in a maximum of 3 sentences.  
Your final proclamation must end with: WINNER: [POKEMON WHO WON THE DEBATE].  

GPT-4o-mini's arguments for ${pokemonA}: ${gptMessages.join(" | ")}  
Claude-3-haiku's arguments for ${pokemonB}: ${claudeMessages.join(" | ")}  
  `,
};

export const claude = claudeConfig;
export const openai = openaiConfig;
export const gemini = geminiConfig;

export default {
  openai: openaiConfig,
  claude: claudeConfig,
  gemini: geminiConfig,
};
