"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
// allowed Origin URLs for CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://real-estate-management-web.vercel.app/",
    config_1.default.FRONTEND_URL,
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            logger_1.default.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-CSRF-Token",
        "X-Session-Id",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    exposedHeaders: ["Authorization", "X-Session-Id", "Content-Disposition"],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
    maxAge: 86400,
};
exports.corsOptions = corsOptions;
