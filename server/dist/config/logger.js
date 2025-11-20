"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// logs/error, logs/warn, logs/info folders
const logDir = "logs";
["error", "warn", "info"].forEach((folder) => {
    const fullPath = path_1.default.join(logDir, folder);
    if (!fs_1.default.existsSync(fullPath)) {
        fs_1.default.mkdirSync(fullPath, { recursive: true });
    }
});
// JSON file log format
const fileLogFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Colorful console logs
const consoleLogFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ level, message, timestamp, stack }) => stack
    ? `${timestamp} [${level}]: ${message}\n${stack}`
    : `${timestamp} [${level}]: ${message}`));
// Typed rotating file creator
const dailyRotateTransport = (filenamePrefix, level) => {
    return new winston_daily_rotate_file_1.default({
        dirname: path_1.default.join(logDir, level),
        filename: `${filenamePrefix}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        level,
        format: fileLogFormat,
    });
};
const logger = winston_1.default.createLogger({
    level: "info",
    transports: [
        dailyRotateTransport("error", "error"),
        dailyRotateTransport("warn", "warn"),
        dailyRotateTransport("combined", "info"),
        new winston_1.default.transports.Console({
            format: consoleLogFormat,
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
