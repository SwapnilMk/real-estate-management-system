import { CorsOptions } from "cors";
import config from "./config";
import logger from "./logger";

// allowed Origin URLs for CORS
const allowedOrigins: string[] = [
  "*",
  "https://real-estate-management-web.vercel.app/",
  config.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
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

export { corsOptions };
