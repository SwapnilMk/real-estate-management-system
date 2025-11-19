import express from "express";
import authRoutes from "./auth.routes";
import propertyRoutes from "./property.routes";
const router = express.Router();

// authentication Routes
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);

export default router;
