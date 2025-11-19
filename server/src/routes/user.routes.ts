import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { isAgent } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", isAgent, getUsers);

export default router;
