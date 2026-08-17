process.env.DEMO_EMAIL = "demo@example.com";
process.env.DEMO_PASSWORD = "password123";
process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const app = require("./index.js");

describe("auth api", () => {
  it("returns a signed JWT for valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "demo@example.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.token.split(".")).toHaveLength(3);
    expect(res.body.user).toEqual({ email: "demo@example.com" });
  });

  it("rejects invalid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "demo@example.com", password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("rejects missing credentials", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.status).toBe(401);
  });

  it("returns the user for a valid token on /auth/me", async () => {
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "demo@example.com", password: "password123" });
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("demo@example.com");
  });

  it("rejects a missing or invalid token on /auth/me", async () => {
    const missing = await request(app).get("/auth/me");
    expect(missing.status).toBe(401);

    const invalid = await request(app).get("/auth/me").set("Authorization", "Bearer not-a-token");
    expect(invalid.status).toBe(401);
  });
});
