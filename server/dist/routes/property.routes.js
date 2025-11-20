"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = require("../controllers/property.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", property_controller_1.getProperties);
router.get("/similar/:id", property_controller_1.getSimilarProperties);
router.get("/:id", property_controller_1.getPropertyById); // This needs to be after specific paths if they conflict, but here IDs are usually safe.
// User routes (Wishlist - assuming all authenticated users can use this, need to check if we want to restrict)
// The original file had no middleware here, but the controller uses req.user.id.
// I should probably add generic auth middleware here, but I will focus on Agent routes as requested.
// Wait, the user request said: "read my backend logic first and add all agent related apis"
// I will verify if generic auth middleware is needed. Usually yes.
// For now, I'll stick to the requested changes.
router.post("/wishlist/:id", property_controller_1.addToWishlist);
router.delete("/wishlist/:id", property_controller_1.removeFromWishlist);
// Agent routes
router.get("/agent/stats", auth_middleware_1.isAgent, property_controller_1.getDashboardStats); // More specific route first
router.get("/agent/properties", auth_middleware_1.isAgent, property_controller_1.getAgentProperties);
router.post("/", auth_middleware_1.isAgent, upload_middleware_1.upload.single("image"), property_controller_1.createProperty);
router.put("/:id", auth_middleware_1.isAgent, upload_middleware_1.upload.single("image"), property_controller_1.updateProperty);
router.delete("/bulk", auth_middleware_1.isAgent, property_controller_1.bulkDeleteProperties); // Bulk delete must come before /:id
router.delete("/:id", auth_middleware_1.isAgent, property_controller_1.deleteProperty);
exports.default = router;
