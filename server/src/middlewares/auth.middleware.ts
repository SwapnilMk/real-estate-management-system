import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload;
}

export const isClient = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const isAgent = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as jwt.JwtPayload;
            if (decoded.role && decoded.role === "AGENT") {
                req.user = decoded;
                next();
            } else {
                res.status(403).json({ message: "Forbidden, agent access required" });
            }
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};