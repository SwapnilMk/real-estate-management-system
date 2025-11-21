"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactMessage = createContactMessage;
exports.getAllContactMessages = getAllContactMessages;
exports.updateContactStatus = updateContactStatus;
const contact_model_1 = __importDefault(require("../models/contact.model"));
/**
 * Create a new contact message
 */
async function createContactMessage(data) {
    try {
        // Validate input
        if (!data.name || !data.email || !data.message) {
            throw new Error("All fields are required");
        }
        // Create contact message
        const contact = await contact_model_1.default.create({
            name: data.name,
            email: data.email,
            message: data.message,
            status: "pending",
        });
        return contact;
    }
    catch (error) {
        // Handle mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors)
                .map((err) => err.message)
                .join(", ");
            throw new Error(messages);
        }
        throw error;
    }
}
/**
 * Get all contact messages (for admin/agent use)
 */
async function getAllContactMessages() {
    return contact_model_1.default.find().sort({ createdAt: -1 });
}
/**
 * Update contact message status
 */
async function updateContactStatus(id, status) {
    return contact_model_1.default.findByIdAndUpdate(id, { status }, { new: true });
}
