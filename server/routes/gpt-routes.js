/* 
OpenAI GPT API routes
*/

import express from "express";
import { generateResponse, getModels } from "../controllers/gpt-controller.js";
const router = express.Router();

/* 
    @route POST /api/gpt
    @desc Generate a response from GPT for the Pokemon debate
    @access Public

*/
router.post("/", generateResponse);

/* 
    @route GET /api/gpt/models
    @desc Get available GPT models
    @access Public

*/
router.get("/models", getModels);

export default router;
