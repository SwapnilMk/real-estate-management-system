"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInterest = exports.updateInterestStatus = exports.getClientInterests = exports.getAgentInterests = exports.createInterest = void 0;
const interest_service_1 = require("../services/interest.service");
/**
 * Client expresses interest in a property
 * POST /api/properties/:id/interest
 */
const createInterest = async (req, res) => {
    try {
        const { message } = req.body;
        const interest = await (0, interest_service_1.createInterest)(req.params.id, req.user.id, message);
        res.status(201).json(interest);
    }
    catch (error) {
        const err = error;
        if (err.message === "Property not found") {
            res.status(404).json({ message: err.message });
        }
        else if (err.message === "You have already expressed interest in this property") {
            res.status(400).json({ message: err.message });
        }
        else {
            console.error(error);
            res.status(500).json({ message: "Error creating interest" });
        }
    }
};
exports.createInterest = createInterest;
/**
 * Get all interests for agent's properties
 * GET /api/agent/interests
 */
const getAgentInterests = async (req, res) => {
    try {
        const { status } = req.query;
        const interests = await (0, interest_service_1.getAgentInterests)(req.user.id, status);
        res.json(interests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching interests" });
    }
};
exports.getAgentInterests = getAgentInterests;
/**
 * Get all interests by the client
 * GET /api/client/interests
 */
const getClientInterests = async (req, res) => {
    try {
        const interests = await (0, interest_service_1.getClientInterests)(req.user.id);
        res.json(interests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching interests" });
    }
};
exports.getClientInterests = getClientInterests;
/**
 * Update interest status (agent only)
 * PATCH /api/agent/interests/:id
 */
const updateInterestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "contacted", "closed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const interest = await (0, interest_service_1.updateInterestStatus)(req.params.id, req.user.id, status);
        res.json(interest);
    }
    catch (error) {
        const err = error;
        if (err.message === "Interest not found") {
            res.status(404).json({ message: err.message });
        }
        else if (err.message === "Not authorized to update this interest") {
            res.status(403).json({ message: err.message });
        }
        else {
            console.error(error);
            res.status(500).json({ message: "Error updating interest" });
        }
    }
};
exports.updateInterestStatus = updateInterestStatus;
/**
 * Delete an interest
 * DELETE /api/interests/:id
 */
const deleteInterest = async (req, res) => {
    try {
        await (0, interest_service_1.deleteInterest)(req.params.id, req.user.id);
        res.json({ message: "Interest deleted successfully" });
    }
    catch (error) {
        const err = error;
        if (err.message === "Interest not found") {
            res.status(404).json({ message: err.message });
        }
        else if (err.message === "Not authorized to delete this interest") {
            res.status(403).json({ message: err.message });
        }
        else {
            console.error(error);
            res.status(500).json({ message: "Error deleting interest" });
        }
    }
};
exports.deleteInterest = deleteInterest;
