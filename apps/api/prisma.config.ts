import "dotenv/config";
import { defineConfig } from "prisma/config";

// El CLI de Prisma migra por la conexion directa, no por el pooler.
// `prisma generate` no se conecta, pero exige una URL: sin DIRECT_URL (por ejemplo en CI)
// usa un host invalido, asi cualquier migracion que se intente sin la variable falla
// con un error que lo deja claro.
const url = process.env.DIRECT_URL ?? "postgresql://x:x@DIRECT_URL-no-configurada.invalid:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url },
});
