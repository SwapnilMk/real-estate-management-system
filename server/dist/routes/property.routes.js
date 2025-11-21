"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = require("../controllers/property.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// Client routes (Wishlist)
router.get("/properties/saved", auth_middleware_1.isAuthenticated, property_controller_1.getSavedProperties);
router.post("/properties/wishlist/:id", auth_middleware_1.isAuthenticated, property_controller_1.addToWishlist);
router.delete("/properties/wishlist/:id", auth_middleware_1.isAuthenticated, property_controller_1.removeFromWishlist);
// Public routes
router.get("/properties", property_controller_1.getProperties);
router.get("/properties/similar/:id", property_controller_1.getSimilarProperties);
router.get("/properties/:id", property_controller_1.getPropertyById);
// Agent routes
router.get("/properties/agent/stats", auth_middleware_1.isAgent, property_controller_1.getDashboardStats);
router.get("/properties/agent/properties", auth_middleware_1.isAgent, property_controller_1.getAgentProperties);
router.post("/properties", auth_middleware_1.isAgent, upload_middleware_1.upload.array("images", 5), property_controller_1.createProperty);
router.put("/properties/:id", auth_middleware_1.isAgent, upload_middleware_1.upload.array("images", 5), property_controller_1.updateProperty);
router.delete("/properties/bulk", auth_middleware_1.isAgent, property_controller_1.bulkDeleteProperties);
router.delete("/properties/:id", auth_middleware_1.isAgent, property_controller_1.deleteProperty);
router.get("/agent/favorites", auth_middleware_1.isAgent, property_controller_1.getAgentFavoritedProperties);
exports.default = router;
