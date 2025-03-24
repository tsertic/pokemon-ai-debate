/**
 * Anthropic Claude API routes
 */
import { Router } from "express";
import claudeController from "../controllers/claude-controller.js";

const router = Router();

/**
 * @route POST /api/claude
 * @desc Generate a response from Claude for the Pokémon debate
 * @access Public
 */
router.post("/", claudeController.generateResponse);

/**
 * @route GET /api/claude/models
 * @desc Get available Claude models
 * @access Public
 */
router.get("/models", claudeController.getModels);

export default router;
