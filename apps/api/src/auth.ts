import type { RequestHandler } from "express";
import type { UserRole } from "./generated/prisma/enums.js";

export interface AuthUser {
  id: string;
  role: UserRole | null;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export function requireRole(...roles: UserRole[]): RequestHandler {
  if (roles.length === 0) throw new Error("requireRole necesita al menos un rol");

  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }
    if (!req.user.role || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    next();
  };
}
