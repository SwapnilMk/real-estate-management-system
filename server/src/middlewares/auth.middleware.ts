import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export interface JwtUser extends jwt.JwtPayload {
  id: string;
  _id?: string;
  role: "AGENT" | "CLIENT";
  user?: JwtUser;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  user?: JwtUser;
}

export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Check header first, then cookie
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtUser;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const isAgent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Check header first, then cookie
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtUser;

      // Determine where the user payload lives (top-level or inside `user`).
      const payload = decoded;
      const isAgentRole =
        payload?.role === "AGENT" ||
        (payload?.user && payload.user.role === "AGENT");

      if (isAgentRole) {
        const userObj: JwtUser = payload.user ? payload.user : payload;

        // Normalize id field if backend uses `_id`.
        if (!userObj.id && userObj._id) {
          userObj.id = userObj._id;
        }

        req.user = userObj;
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
