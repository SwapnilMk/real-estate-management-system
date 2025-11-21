"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContactMessage = submitContactMessage;
exports.getContactMessages = getContactMessages;
const contact_service_1 = require("../services/contact.service");
/**
 * Submit a new contact message
 * POST /contact
 * Public endpoint - no authentication required
 */
async function submitContactMessage(req, res) {
    try {
        const { name, email, message } = req.body;
        // Validate request body
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // Create contact message
        const contact = await (0, contact_service_1.createContactMessage)({ name, email, message });
        return res.status(201).json({
            success: true,
            message: "Message sent successfully! We'll get back to you soon.",
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                createdAt: contact.createdAt,
            },
        });
    }
    catch (err) {
        console.error("Contact submission error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to send message. Please try again later.",
        });
    }
}
/**
 * Get all contact messages
 * GET /contacts
 * Protected endpoint - agents only
 */
async function getContactMessages(req, res) {
    try {
        const contacts = await (0, contact_service_1.getAllContactMessages)();
        return res.status(200).json({
            success: true,
            data: contacts,
            count: contacts.length,
        });
    }
    catch (err) {
        console.error("Get contacts error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch contact messages.",
        });
    }
}
