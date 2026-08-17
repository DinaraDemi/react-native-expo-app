import { decodeToken, isTokenExpired, userFromTokenClaims } from "@/utils/jwt";

const base64Url = (value: object) =>
  btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const makeToken = (payload: object) =>
  `${base64Url({ alg: "HS256", typ: "JWT" })}.${base64Url(payload)}.signature`;

describe("decodeToken", () => {
  it("decodes a JWT payload", () => {
    const claims = decodeToken(makeToken({ sub: "a@b.com", email: "a@b.com", exp: 9999999999 }));
    expect(claims.email).toBe("a@b.com");
    expect(claims.sub).toBe("a@b.com");
    expect(claims.exp).toBe(9999999999);
  });

  it("throws for a malformed token", () => {
    expect(() => decodeToken("not-a-jwt")).toThrow();
  });
});

describe("isTokenExpired", () => {
  it("returns true when the expiry has passed", () => {
    expect(isTokenExpired({ exp: 100 }, 200_000)).toBe(true);
  });

  it("returns false while the token is still valid", () => {
    expect(isTokenExpired({ exp: 300 }, 200_000)).toBe(false);
  });

  it("returns false when there is no expiry claim", () => {
    expect(isTokenExpired({ sub: "a@b.com" })).toBe(false);
  });

  it("defaults the reference time to now", () => {
    const past = Math.floor(Date.now() / 1000) - 60;
    const future = Math.floor(Date.now() / 1000) + 60;
    expect(isTokenExpired({ exp: past })).toBe(true);
    expect(isTokenExpired({ exp: future })).toBe(false);
  });
});

describe("userFromTokenClaims", () => {
  it("prefers the email claim", () => {
    expect(userFromTokenClaims({ sub: "subject", email: "a@b.com" })).toEqual({ email: "a@b.com" });
  });

  it("falls back to the subject", () => {
    expect(userFromTokenClaims({ sub: "subject" })).toEqual({ email: "subject" });
  });

  it("falls back to a generic value", () => {
    expect(userFromTokenClaims({})).toEqual({ email: "unknown" });
  });
});
