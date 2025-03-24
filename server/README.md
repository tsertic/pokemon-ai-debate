# Pokémon AI Debate Server

A Node.js Express server that handles API interactions with multiple AI services (OpenAI, Anthropic, and Google) for the Pokémon AI Debate application.

## Overview

This server acts as a middleware between the Pokémon AI Debate frontend and various AI service providers. It handles authentication, request formatting, and response processing for GPT, Claude, and Gemini AI models, keeping API keys secure on the server side.

## Features

- **Secure API Key Management**: Keeps all API keys on the server side
- **Multiple AI Service Integration**:
  - OpenAI's GPT models for Pokémon A arguments
  - Anthropic's Claude models for Pokémon B arguments
  - Google's Gemini models for judging debates
- **Unified API Interface**: Standardized endpoints for all AI interactions
- **Error Handling**: Comprehensive error catching and reporting
- **Logging**: Detailed logging for debugging and monitoring
- **Rate Limiting**: Basic protection against excessive requests

## Project Structure

```
server/
│
├── config/                  # Configuration files
│   ├── env.js               # Environment variables setup
│   └── ai-config.js         # AI model configurations
│
├── controllers/             # Route handlers
│   ├── gpt-controller.js    # GPT API route handlers
│   ├── claude-controller.js # Claude API route handlers
│   └── gemini-controller.js # Gemini API route handlers
│
├── services/                # Business logic
│   ├── gpt-service.js       # OpenAI API integration
│   ├── claude-service.js    # Anthropic API integration
│   └── gemini-service.js    # Google AI integration
│
├── utils/                   # Utility functions
│   ├── message-formatter.js # Format messages for different AI models
│   ├── error-handler.js     # Error handling utilities
│   └── logger.js            # Logging utilities
│
├── middleware/              # Express middleware
│   ├── error-middleware.js  # Error handling middleware
│   └── logger-middleware.js # Request logging middleware
│
├── routes/                  # API routes
│   ├── gpt-routes.js        # GPT API routes
│   ├── claude-routes.js     # Claude API routes
│   ├── gemini-routes.js     # Gemini API routes
│   └── index.js             # Route aggregator
│
├── logs/                    # Log files (created at runtime)
├── .env                     # Environment variables (not in git)
├── package.json             # Project dependencies
└── server.js                # Entry point
```

## API Endpoints

### GPT (OpenAI)

- **POST /api/gpt**
  - Generates response from GPT for Pokémon A
  - Body: `{ messages, pokemonA }`

### Claude (Anthropic)

- **POST /api/claude**
  - Generates response from Claude for Pokémon B
  - Body: `{ messages, pokemonB }`

### Gemini (Google)

- **POST /api/gemini**
  - Generates a verdict for the debate
  - Body: `{ gptMessages, claudeMessages, pokemonA, pokemonB }`

### Health Check

- **GET /api/health**
  - Returns server status

## Setup

### Prerequisites

- Node.js (v16 or higher)
- API keys for OpenAI, Anthropic, and Google AI

### Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Security Considerations

- Never commit your `.env` file to version control
- Use HTTPS in production
- Consider adding authentication for the API endpoints in production
- Implement more robust rate limiting for a production environment

## Troubleshooting

Common issues:

1. **API Key Errors**: Check that your API keys in the `.env` file are correct and have proper permissions
2. **Module Not Found Errors**: Make sure file extensions (.js) are included in import statements
3. **Port Conflicts**: If port 3001 is already in use, change the PORT in your .env file
