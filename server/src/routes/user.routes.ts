import { Router } from "express";
import {
  getUsers,
  updateUserProfile,
  changePassword,
} from "../controllers/user.controller";
import { isAgent, isAuthenticated } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", isAgent, getUsers);
router.put(
  "/profile",
  isAuthenticated,
  upload.single("avatar"),
  updateUserProfile,
);
router.post("/change-password", isAuthenticated, changePassword);

export default router;
