import type { RequestHandler } from "express";
import type { UserRole } from "./generated/prisma/enums.js";
import { errors } from "jose";
import type { VerifyToken } from "./tokens.js";
import type { UserStore } from "./users.js";

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

export function authenticate(verifyToken: VerifyToken, users: UserStore): RequestHandler {
  return async (req, res, next) => {
    const [scheme, token] = req.header("authorization")?.split(" ") ?? [];
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }

    try {
      const claims = await verifyToken(token);
      const { removed, ...user } = await users.upsertFromClaims(claims);
      if (removed) {
        res.status(403).json({ error: "forbidden" });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof errors.JOSEError) {
        res.status(401).json({ error: "unauthenticated" });
        return;
      }
      next(error);
    }
  };
}
