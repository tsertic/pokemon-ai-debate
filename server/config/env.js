//Environment configuration setup
//This module loads envionment variables and validates required ones

import { config } from "dotenv";
import { resolve } from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Load environment variables from .env file

config({ path: resolve(__dirname, "../.env") });

//Required env variables

const requiredEnvVars = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
];

//Validate that all required env vars are set up

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(" ERROR: Missing required env variable: ");
  missingEnvVars.forEach((envVar) => console.error(` -${envVar}`));
  console.error("Please set these variables in your .env file");
  process.exit(1);
}

//set default values for optional environment variables

if (!process.env.PORT) {
  process.env.PORT = "3001";
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

//export enviroment variables as structured object

const env = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
};

export default env;
