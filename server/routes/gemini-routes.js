/**
 * Google Gemini API routes
 */
import { Router } from "express";
import geminiController from "../controllers/gemini-controller.js";

const router = Router();

/**
 * @route POST /api/gemini
 * @desc Generate a verdict from Gemini for the Pokémon debate
 * @access Public
 */
router.post("/", geminiController.generateVerdict);

/**
 * @route GET /api/gemini/models
 * @desc Get available Gemini models
 * @access Public
 */
router.get("/models", geminiController.getModels);

export default router;
