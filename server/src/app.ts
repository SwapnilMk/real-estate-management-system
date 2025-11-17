import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors";
import apiRoutes from "./routes";
import { limiter } from "./config/rate-limit";
const app = express();

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

// all api routes
app.use("/api/v1", apiRoutes);

// Fallback 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    route: req.originalUrl,
  });
});

export default app;
