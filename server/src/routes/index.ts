import express from "express";
import authRoutes from "./auth.routes";
import propertyRoutes from "./property.routes";
import userRoutes from "./user.routes";
import interestRoutes from "./interest.routes";
import contactRoutes from "./contact.routes";

const router = express.Router();

// authentication Routes
router.use("/auth", authRoutes);
router.use("/", propertyRoutes); // Properties routes include /properties prefix
router.use("/users", userRoutes);
router.use("/", interestRoutes); // Interest routes include their own prefixes
router.use("/", contactRoutes); // Contact routes

export default router;
