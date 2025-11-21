"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
/**
 * POST /contact
 * Submit a new contact message
 * Public endpoint - no authentication required
 */
router.post("/contact", contact_controller_1.submitContactMessage);
/**
 * GET /contacts
 * Get all contact messages
 * Protected endpoint - agents only
 */
router.get("/contacts", auth_middleware_1.isAgent, contact_controller_1.getContactMessages);
exports.default = router;
