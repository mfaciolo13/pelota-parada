import express from "express";

export interface AppDeps {
  /** Verifica que la base de datos responde. Si no se pasa, /health/db no existe. */
  pingDb?: () => Promise<void>;
}

export function createApp({ pingDb }: AppDeps = {}) {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  if (pingDb) {
    app.get("/health/db", async (_req, res) => {
      try {
        await pingDb();
        res.status(200).json({ status: "ok", db: "ok" });
      } catch {
        res.status(503).json({ status: "error", db: "unreachable" });
      }
    });
  }

  return app;
}
