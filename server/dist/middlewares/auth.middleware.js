"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAgent = exports.isClient = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const isClient = (req, res, next) => {
    // Check header first, then cookie
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        token = req.cookies.jwt;
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_ACCESS_SECRET);
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
exports.isClient = isClient;
const isAgent = (req, res, next) => {
    // Check header first, then cookie
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        token = req.cookies.jwt;
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_ACCESS_SECRET);
            // Determine where the user payload lives (top-level or inside `user`).
            const payload = decoded;
            const isAgentRole = payload?.role === "AGENT" ||
                (payload?.user && payload.user.role === "AGENT");
            if (isAgentRole) {
                const userObj = payload.user ? payload.user : payload;
                // Normalize id field if backend uses `_id`.
                if (!userObj.id && userObj._id) {
                    userObj.id = userObj._id;
                }
                req.user = userObj;
                next();
            }
            else {
                res.status(403).json({ message: "Forbidden, agent access required" });
            }
        }
        catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
exports.isAgent = isAgent;
