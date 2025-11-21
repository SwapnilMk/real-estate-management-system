import express from "express";
import {
  submitContactMessage,
  getContactMessages,
} from "../controllers/contact.controller";
import { isAgent } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * POST /contact
 * Submit a new contact message
 * Public endpoint - no authentication required
 */
router.post("/contact", submitContactMessage);

/**
 * GET /contacts
 * Get all contact messages
 * Protected endpoint - agents only
 */
router.get("/contacts", isAgent, getContactMessages);

export default router;
