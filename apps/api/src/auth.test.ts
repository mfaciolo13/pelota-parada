import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { requireRole, type AuthUser } from "./auth.js";

const buildApp = () => {
  const app = express();

  app.use((req, _res, next) => {
    const header = req.header("x-test-user");
    if (header) req.user = JSON.parse(header) as AuthUser;
    next();
  });
  app.get("/organizer", requireRole("ORGANIZER", "ADMIN"), (_req, res) => {
    res.json({ ok: true });
  });
  app.get("/admin", requireRole("ADMIN"), (_req, res) => {
    res.json({ ok: true });
  });

  return app;
};

describe("requireRole", () => {
  let server: Server;
  let baseUrl = "";

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = buildApp().listen(0, () => resolve());
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  const call = (path: string, user?: AuthUser) =>
    fetch(`${baseUrl}${path}`, { headers: user ? { "x-test-user": JSON.stringify(user) } : {} });

  it("responde 401 si no hay usuario autenticado", async () => {
    const res = await call("/organizer");

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "unauthenticated" });
  });

  it("responde 403 si el usuario todavia no eligio un rol", async () => {
    const res = await call("/organizer", { id: "u1", role: null });

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "forbidden" });
  });

  it("responde 403 si el rol no esta entre los permitidos", async () => {
    const res = await call("/organizer", { id: "u1", role: "PLAYER" });

    expect(res.status).toBe(403);
  });

  it("deja pasar a cualquiera de los roles permitidos", async () => {
    const organizer = await call("/organizer", { id: "u1", role: "ORGANIZER" });
    const admin = await call("/organizer", { id: "u2", role: "ADMIN" });

    expect(organizer.status).toBe(200);
    expect(admin.status).toBe(200);
  });

  it("el rol de admin no se hereda en endpoints que lo exigen solo a el", async () => {
    const organizer = await call("/admin", { id: "u1", role: "ORGANIZER" });
    const admin = await call("/admin", { id: "u2", role: "ADMIN" });

    expect(organizer.status).toBe(403);
    expect(admin.status).toBe(200);
  });

  it("falla al crearse sin ningun rol", () => {
    expect(() => requireRole()).toThrow();
  });
});
