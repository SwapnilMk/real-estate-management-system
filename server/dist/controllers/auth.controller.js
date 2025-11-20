"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.requestPasswordReset = requestPasswordReset;
exports.resetPassword = resetPassword;
const auth_service_1 = require("../services/auth.service");
// registration controller
async function register(req, res) {
    try {
        const { user, accessToken, refreshToken } = await (0, auth_service_1.registerService)(req.body);
        res.cookie("refreshToken", refreshToken, auth_service_1.COOKIE_OPTIONS);
        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}
// login controller
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await (0, auth_service_1.loginService)(email, password);
        res.cookie("refreshToken", refreshToken, auth_service_1.COOKIE_OPTIONS);
        return res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    }
    catch (err) {
        return res.status(401).json({ message: err.message });
    }
}
// ref token
async function refreshToken(req, res) {
    try {
        const token = req.cookies?.refreshToken;
        if (!token)
            return res.status(401).json({ message: "No token" });
        const { user, accessToken, refreshToken } = await (0, auth_service_1.refreshTokenService)(token);
        res.cookie("refreshToken", refreshToken, auth_service_1.COOKIE_OPTIONS);
        return res.json({ user, accessToken });
    }
    catch (err) {
        return res.status(401).json({ message: err.message });
    }
}
// logout
function logout(req, res) {
    res.clearCookie("refreshToken", auth_service_1.COOKIE_OPTIONS);
    return res.json({ message: "Logged out" });
}
// password forgot
async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        await (0, auth_service_1.forgotPasswordService)(email);
        return res.json({ message: "If email exists, reset link sent." });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
// password reset
async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const { accessToken, refreshToken } = await (0, auth_service_1.resetPasswordService)(token, password);
        res.cookie("refreshToken", refreshToken, auth_service_1.COOKIE_OPTIONS);
        return res.json({
            message: "Password reset successful",
            accessToken,
        });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}
