import { Router } from "express";
import {
  createInterest,
  getAgentInterests,
  getClientInterests,
  updateInterestStatus,
  deleteInterest,
} from "../controllers/interest.controller";
import { isClient, isAgent } from "../middlewares/auth.middleware";

const router = Router();

// Client routes - express interest in a property
router.post("/properties/:id/interest", isClient, createInterest);
router.get("/client/interests", isClient, getClientInterests);

// Agent routes - view and manage interests
router.get("/agent/interests", isAgent, getAgentInterests);
router.patch("/agent/interests/:id", isAgent, updateInterestStatus);

// Shared route - delete interest (both client and agent can delete)
router.delete("/interests/:id", isClient, deleteInterest);

export default router;
