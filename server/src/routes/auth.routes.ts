import express from "express";
import * as auth from "../controllers/auth.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

// user registration route
router.post("/register", upload.single("avatar"), auth.register);

// user login route
router.post("/login", auth.login);

// user logout route
router.post("/logout", auth.logout);

// forgot password route
router.post("/forgot-password", auth.requestPasswordReset);

// reset password route
router.post("/reset-password/:token", auth.resetPassword);

// refresh token route
router.post("/refresh", auth.refreshToken);

export default router;
