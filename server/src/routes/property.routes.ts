import { Router } from "express";
import {
  getProperties,
  getPropertyById,
  getSimilarProperties,
  addToWishlist,
  removeFromWishlist,
  createProperty,
  updateProperty,
  getAgentProperties,
  getDashboardStats,
} from "../controllers/property.controller";
import { isAgent } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Public routes
router.get("/", getProperties);
router.get("/similar/:id", getSimilarProperties);
router.get("/:id", getPropertyById); // This needs to be after specific paths if they conflict, but here IDs are usually safe.

// User routes (Wishlist - assuming all authenticated users can use this, need to check if we want to restrict)
// The original file had no middleware here, but the controller uses req.user.id.
// I should probably add generic auth middleware here, but I will focus on Agent routes as requested.
// Wait, the user request said: "read my backend logic first and add all agent related apis"
// I will verify if generic auth middleware is needed. Usually yes.
// For now, I'll stick to the requested changes.

router.post("/wishlist/:id", addToWishlist);
router.delete("/wishlist/:id", removeFromWishlist);

// Agent routes
router.get("/agent/stats", isAgent, getDashboardStats); // More specific route first
router.get("/agent/properties", isAgent, getAgentProperties);
router.post("/", isAgent, upload.single("image"), createProperty);
router.put("/:id", isAgent, upload.single("image"), updateProperty);

export default router;
