"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interest_controller_1 = require("../controllers/interest.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Client routes - express interest in a property
router.post("/properties/:id/interest", auth_middleware_1.isClient, interest_controller_1.createInterest);
router.get("/client/interests", auth_middleware_1.isClient, interest_controller_1.getClientInterests);
// Agent routes - view and manage interests
router.get("/agent/interests", auth_middleware_1.isAgent, interest_controller_1.getAgentInterests);
router.patch("/agent/interests/:id", auth_middleware_1.isAgent, interest_controller_1.updateInterestStatus);
// Shared route - delete interest (both client and agent can delete)
router.delete("/interests/:id", auth_middleware_1.isClient, interest_controller_1.deleteInterest);
exports.default = router;
