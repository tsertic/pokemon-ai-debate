import express, { json } from "express";
import cors from "cors";
import { requestLogger } from "./middleware/logger-middleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error-middleware.js";
import routes from "./routes/index.js";
import "./config/env.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(json());
app.use(requestLogger);

// Routes
app.use("/api", routes);

// 404 handler - must be after routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
