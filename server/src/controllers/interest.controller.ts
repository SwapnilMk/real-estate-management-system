import { Request, Response } from "express";
import {
  createInterest as createInterestService,
  getAgentInterests as getAgentInterestsService,
  getClientInterests as getClientInterestsService,
  updateInterestStatus as updateInterestStatusService,
  deleteInterest as deleteInterestService,
} from "../services/interest.service";

/**
 * Client expresses interest in a property
 * POST /api/properties/:id/interest
 */
export const createInterest = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const interest = await createInterestService(
      req.params.id,
      req.user!.id,
      message,
    );
    res.status(201).json(interest);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "Property not found") {
      res.status(404).json({ message: err.message });
    } else if (
      err.message === "You have already expressed interest in this property"
    ) {
      res.status(400).json({ message: err.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Error creating interest" });
    }
  }
};

/**
 * Get all interests for agent's properties
 * GET /api/agent/interests
 */
export const getAgentInterests = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const interests = await getAgentInterestsService(
      req.user!.id,
      status as string,
    );
    res.json(interests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching interests" });
  }
};

/**
 * Get all interests by the client
 * GET /api/client/interests
 */
export const getClientInterests = async (req: Request, res: Response) => {
  try {
    const interests = await getClientInterestsService(req.user!.id);
    res.json(interests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching interests" });
  }
};

/**
 * Update interest status (agent only)
 * PATCH /api/agent/interests/:id
 */
export const updateInterestStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!["pending", "contacted", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const interest = await updateInterestStatusService(
      req.params.id,
      req.user!.id,
      status,
    );
    res.json(interest);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "Interest not found") {
      res.status(404).json({ message: err.message });
    } else if (err.message === "Not authorized to update this interest") {
      res.status(403).json({ message: err.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Error updating interest" });
    }
  }
};

/**
 * Delete an interest
 * DELETE /api/interests/:id
 */
export const deleteInterest = async (req: Request, res: Response) => {
  try {
    await deleteInterestService(req.params.id, req.user!.id);
    res.json({ message: "Interest deleted successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "Interest not found") {
      res.status(404).json({ message: err.message });
    } else if (err.message === "Not authorized to delete this interest") {
      res.status(403).json({ message: err.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Error deleting interest" });
    }
  }
};
