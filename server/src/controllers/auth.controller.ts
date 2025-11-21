import { Request, Response } from "express";
import {
  registerService,
  loginService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  COOKIE_OPTIONS,
} from "../services/auth.service";
import { uploadToCloudinary } from "../middlewares/upload.middleware";

// registration controller
export async function register(req: Request, res: Response) {
  try {
    let avatarUrl = "";
    if (req.file) {
      const result: any = await uploadToCloudinary(req.file);
      avatarUrl = result.secure_url;
    }

    const userData = {
      ...req.body,
      avatar: avatarUrl,
    };

    const { user, accessToken, refreshToken } = await registerService(userData);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

// login controller
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginService(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    });
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
}

// ref token
export async function refreshToken(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No token" });

    const { user, accessToken, refreshToken } =
      await refreshTokenService(token);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.json({ user, accessToken });
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
}

// logout
export function logout(req: Request, res: Response) {
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  return res.json({ message: "Logged out" });
}

// password forgot
export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    return res.json({ message: "If email exists, reset link sent." });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

// password reset
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const { accessToken, refreshToken } = await resetPasswordService(
      token,
      password,
    );

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.json({
      message: "Password reset successful",
      accessToken,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
