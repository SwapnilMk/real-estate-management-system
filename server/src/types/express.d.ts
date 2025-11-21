import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IUser {
  id: string;
  role: "AGENT" | "CLIENT";
  [key: string]: any;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}
