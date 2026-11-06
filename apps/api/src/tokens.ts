import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

export interface TokenClaims {
  id: string;
  email?: string;
  name?: string;
}

export type VerifyToken = (token: string) => Promise<TokenClaims>;

export function createTokenVerifier(supabaseUrl: string, keys?: JWTVerifyGetKey): VerifyToken {
  const issuer = `${supabaseUrl.replace(/\/$/, "")}/auth/v1`;
  const getKey = keys ?? createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));

  return async (token) => {
    const { payload } = await jwtVerify(token, getKey, { issuer, audience: "authenticated" });
    if (!payload.sub) throw new Error("El token no tiene sub");

    const metadata = (payload.user_metadata ?? {}) as Record<string, unknown>;
    const name = [metadata.full_name, metadata.name].find((v) => typeof v === "string" && v.trim());

    return {
      id: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      name: name as string | undefined,
    };
  };
}
