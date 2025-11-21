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
import { isAgent, isClient } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Client routes (Wishlist)
router.get("/properties/saved", isClient, getSavedProperties);
router.post("/properties/wishlist/:id", isClient, addToWishlist);
router.delete("/properties/wishlist/:id", isClient, removeFromWishlist);

// Public routes
router.get("/properties", getProperties);
router.get("/properties/similar/:id", getSimilarProperties);
router.get("/properties/:id", getPropertyById);

// Agent routes
router.get("/properties/agent/stats", isAgent, getDashboardStats);
router.get("/properties/agent/properties", isAgent, getAgentProperties);
router.post("/properties", isAgent, upload.single("image"), createProperty);
router.put("/properties/:id", isAgent, upload.single("image"), updateProperty);
router.delete("/properties/bulk", isAgent, bulkDeleteProperties);
router.delete("/properties/:id", isAgent, deleteProperty);

router.get("/agent/favorites", isAgent, getAgentFavoritedProperties);

export default router;
