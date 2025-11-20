"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_OPTIONS = void 0;
exports.registerService = registerService;
exports.loginService = loginService;
exports.refreshTokenService = refreshTokenService;
exports.forgotPasswordService = forgotPasswordService;
exports.resetPasswordService = resetPasswordService;
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../utils/email");
const config_1 = __importDefault(require("../config/config"));
exports.COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config_1.default.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
// User Register Service
async function registerService(data) {
    const { name, email, password, role } = data;
    const existing = await user_model_1.default.findOne({ email });
    if (existing)
        throw new Error("Email already registered");
    const user = new user_model_1.default({ name, email, password, role });
    await user.save();
    const accessToken = (0, jwt_1.signAccessToken)({ id: user._id, role: user.role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ id: user._id });
    return { user, accessToken, refreshToken };
}
// user login service
async function loginService(email, password) {
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const accessToken = (0, jwt_1.signAccessToken)({ id: user._id, role: user.role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ id: user._id });
    return { user, accessToken, refreshToken };
}
// refresh token
async function refreshTokenService(token) {
    const payload = (0, jwt_1.verifyRefreshToken)(token);
    const user = await user_model_1.default.findById(payload.id).select("-password");
    if (!user)
        throw new Error("User not found");
    const accessToken = (0, jwt_1.signAccessToken)({ id: user._id, role: user.role });
    const newRefresh = (0, jwt_1.signRefreshToken)({ id: user._id });
    return { user, accessToken, refreshToken: newRefresh };
}
// pass forgot service
async function forgotPasswordService(email) {
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        return true; // always return success (avoid exposing users)
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${config_1.default.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `<p>You requested a password reset. Click here (valid 1 hour): <a href="${resetURL}">${resetURL}</a></p>`;
    await (0, email_1.sendEmail)(user.email, "Password Reset", html);
    return true;
}
// password reset
async function resetPasswordService(token, password) {
    const hashed = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await user_model_1.default.findOne({
        resetPasswordToken: hashed,
        resetPasswordExpires: { $gt: new Date() },
    });
    if (!user)
        throw new Error("Token invalid or expired");
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    const accessToken = (0, jwt_1.signAccessToken)({ id: user._id, role: user.role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ id: user._id });
    return { accessToken, refreshToken };
}
