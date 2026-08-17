const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");

dotenv.config();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_TTL = process.env.TOKEN_TTL || "8h";

// Optional demo account. When DEMO_EMAIL/DEMO_PASSWORD are set, only that
// account can sign in. When unset, any non-empty credentials are accepted so
// the JWT flow is easy to try during development.
const DEMO_EMAIL = process.env.DEMO_EMAIL || null;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || null;

const app = express();
app.use(cors());
app.use(express.json());

function credentialsAreValid(email, password) {
  if (!email || !password) return false;
  if (DEMO_EMAIL && DEMO_PASSWORD) {
    return email === DEMO_EMAIL && password === DEMO_PASSWORD;
  }
  return true;
}

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!credentialsAreValid(email, password)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign({ sub: email, email }, JWT_SECRET, { expiresIn: TOKEN_TTL });
  return res.json({ token, user: { email } });
});

app.get("/auth/me", (req, res) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ user: { email: payload.email } });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Auth API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
