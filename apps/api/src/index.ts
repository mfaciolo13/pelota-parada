import { createApp } from "./app.js";
import { authenticate } from "./auth.js";
import { prisma } from "./db.js";
import { env } from "./env.js";
import { createTokenVerifier } from "./tokens.js";
import { createUserStore } from "./users.js";

const app = createApp({
  pingDb: async () => {
    await prisma.$queryRaw`SELECT 1`;
  },
  authenticate: authenticate(createTokenVerifier(env.SUPABASE_URL), createUserStore(prisma)),
});

app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`);
});
