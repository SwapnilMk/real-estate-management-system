import User from "../models/user.model";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import crypto from "crypto";
import { sendEmail } from "../utils/email";
import config from "../config/config";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: (config.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax"
    | "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// User Register Service
export async function registerService(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  phoneNumber?: string;
  avatar?: string;
}) {
  const { name, email, password, role, phoneNumber, avatar } = data;

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const user = new User({
    name,
    email,
    password,
    role,
    phoneNumber,
    avatar,
  });
  await user.save();

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  return { user, accessToken, refreshToken };
}

// user login service
export async function loginService(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  return { user, accessToken, refreshToken };
}

// refresh token
export async function refreshTokenService(token: string) {
  const payload = verifyRefreshToken(token) as any;

  const user = await User.findById(payload.id).select("-password");
  if (!user) throw new Error("User not found");

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const newRefresh = signRefreshToken({ id: user._id });

  return { user, accessToken, refreshToken: newRefresh };
}

// pass forgot service
export async function forgotPasswordService(email: string) {
  const user = await User.findOne({ email });
  if (!user) return true; // always return success (avoid exposing users)

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${config.FRONTEND_URL}/reset-password/${resetToken}`;
  const html = `<p>You requested a password reset. Click here (valid 1 hour): <a href="${resetURL}">${resetURL}</a></p>`;

  await sendEmail(user.email, "Password Reset", html);
  return true;
}

// password reset
export async function resetPasswordService(token: string, password: string) {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) throw new Error("Token invalid or expired");

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  return { accessToken, refreshToken };
}
