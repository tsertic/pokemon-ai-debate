/**
 * API routes index
 * Combines all route modules into a single router
 */
import { Router } from "express";
import gptRoutes from "./gpt-routes.js";
import claudeRoutes from "./claude-routes.js";
import geminiRoutes from "./gemini-routes.js";

const router = Router();

// Mount the API-specific routes
router.use("/gpt", gptRoutes);
router.use("/claude", claudeRoutes);
router.use("/gemini", geminiRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
