import { createApp } from "./app.js";
import { prisma } from "./db.js";
import { env } from "./env.js";

const app = createApp({
  pingDb: async () => {
    await prisma.$queryRaw`SELECT 1`;
  },
});

app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`);
});
