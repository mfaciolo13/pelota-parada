import { describe, expect, it } from "vitest";

// env.ts valida process.env al importarlo, asi que se carga con las variables de prueba.
process.env.DATABASE_URL = "postgresql://potrero:potrero@localhost:5432/potrero";
process.env.SUPABASE_URL = "https://abc.supabase.co";
const { parseEnv } = await import("./env.js");

const URL_VALIDA = "postgresql://potrero:potrero@localhost:5432/potrero";
const SUPABASE = "https://abc.supabase.co";

describe("parseEnv", () => {
  it("usa el puerto 3000 por defecto", () => {
    expect(parseEnv({ DATABASE_URL: URL_VALIDA, SUPABASE_URL: SUPABASE }).PORT).toBe(3000);
  });

  it("convierte PORT a numero", () => {
    expect(parseEnv({ DATABASE_URL: URL_VALIDA, SUPABASE_URL: SUPABASE, PORT: "4100" }).PORT).toBe(4100);
  });

  it("acepta los esquemas postgres y postgresql", () => {
    expect(() => parseEnv({ DATABASE_URL: "postgres://u:p@localhost:5432/db", SUPABASE_URL: SUPABASE })).not.toThrow();
    expect(() => parseEnv({ DATABASE_URL: URL_VALIDA, SUPABASE_URL: SUPABASE })).not.toThrow();
  });

  it("rechaza si falta DATABASE_URL", () => {
    expect(() => parseEnv({})).toThrow();
  });

  it("rechaza una DATABASE_URL que no es de Postgres", () => {
    expect(() => parseEnv({ DATABASE_URL: "mysql://u:p@localhost:3306/db", SUPABASE_URL: SUPABASE })).toThrow();
    expect(() => parseEnv({ DATABASE_URL: "no-es-una-url", SUPABASE_URL: SUPABASE })).toThrow();
  });

  it("rechaza si falta SUPABASE_URL o no es una URL", () => {
    expect(() => parseEnv({ DATABASE_URL: URL_VALIDA })).toThrow();
    expect(() => parseEnv({ DATABASE_URL: URL_VALIDA, SUPABASE_URL: "abc" })).toThrow();
  });

  it("rechaza un PORT invalido", () => {
    expect(() => parseEnv({ DATABASE_URL: URL_VALIDA, SUPABASE_URL: SUPABASE, PORT: "abc" })).toThrow();
    expect(() => parseEnv({ DATABASE_URL: URL_VALIDA, SUPABASE_URL: SUPABASE, PORT: "70000" })).toThrow();
  });
});
