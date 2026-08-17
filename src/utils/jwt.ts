import { jwtDecode } from "jwt-decode";

export interface AuthTokenClaims {
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
}

export const decodeToken = (token: string): AuthTokenClaims => jwtDecode<AuthTokenClaims>(token);

export const isTokenExpired = (claims: AuthTokenClaims, now: number = Date.now()): boolean =>
  typeof claims.exp === "number" && claims.exp * 1000 <= now;

export const userFromTokenClaims = (claims: AuthTokenClaims): { email: string } => ({
  email: claims.email || claims.sub || "unknown",
});
