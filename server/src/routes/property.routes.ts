import { Router } from "express";
import {
  getProperties,
  getPropertyById,
  getSimilarProperties,
  addToWishlist,
  removeFromWishlist,
  getSavedProperties,
  createProperty,
  updateProperty,
  getAgentProperties,
  getDashboardStats,
  deleteProperty,
  bulkDeleteProperties,
  getAgentFavoritedProperties,
} from "../controllers/property.controller";
import { isAgent, isAuthenticated } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Client routes (Wishlist)
router.get("/properties/saved", isAuthenticated, getSavedProperties);
router.post("/properties/wishlist/:id", isAuthenticated, addToWishlist);
router.delete("/properties/wishlist/:id", isAuthenticated, removeFromWishlist);

// Public routes
router.get("/properties", getProperties);
router.get("/properties/similar/:id", getSimilarProperties);
router.get("/properties/:id", getPropertyById);

// Agent routes
router.get("/properties/agent/stats", isAgent, getDashboardStats);
router.get("/properties/agent/properties", isAgent, getAgentProperties);
router.post("/properties", isAgent, upload.array("images", 5), createProperty);
router.put(
  "/properties/:id",
  isAgent,
  upload.array("images", 5),
  updateProperty,
);
router.delete("/properties/bulk", isAgent, bulkDeleteProperties);
router.delete("/properties/:id", isAgent, deleteProperty);

router.get("/agent/favorites", isAgent, getAgentFavoritedProperties);

export default router;
