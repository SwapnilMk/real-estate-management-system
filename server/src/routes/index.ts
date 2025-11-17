import express from "express";
import authRoutes from "./auth.routes";
const router = express.Router();

// authentication Routes
router.use("/auth", authRoutes);

export default router;
