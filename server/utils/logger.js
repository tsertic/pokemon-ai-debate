/**
 * Logging utility
 * Provides consistent logging throughout the application
 */
import {
  format as _format,
  createLogger,
  transports as _transports,
} from "winston";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Define log format
const logFormat = _format.combine(
  _format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  _format.errors({ stack: true }),
  _format.splat(),
  _format.json()
);

// Define log directory
const logDir = join(__dirname, "../logs");

// Create logger instance
const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  defaultMeta: { service: "pokemon-debate-api" },
  transports: [
    // Console transport for all environments
    new _transports.Console({
      format: _format.combine(
        _format.colorize(),
        _format.printf(
          (info) =>
            `${info.timestamp} ${info.level}: ${info.message}${
              info.stack ? "\n" + info.stack : ""
            }`
        )
      ),
    }),

    // File transports for non-test environments
    ...(process.env.NODE_ENV !== "test"
      ? [
          // Save all logs to combined.log
          new _transports.File({
            filename: join(logDir, "combined.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),

          // Save error logs to error.log
          new _transports.File({
            filename: join(logDir, "error.log"),
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ]
      : []),
  ],
});

// Create a stream object for Morgan integration
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

export default logger;
