import { hasErrors, validateEmail, validateLoginForm, validatePassword } from "@/utils/validation";

describe("validateEmail", () => {
  it("accepts a valid email", () => {
    expect(validateEmail("user@example.com")).toBeUndefined();
  });

  it("trims surrounding whitespace", () => {
    expect(validateEmail("  a@b.com  ")).toBeUndefined();
  });

  it("rejects a missing email", () => {
    expect(validateEmail("")).toBe("Email is required.");
  });

  it("rejects a whitespace-only email", () => {
    expect(validateEmail("   ")).toBe("Email is required.");
  });

  it("rejects a malformed email", () => {
    expect(validateEmail("not-an-email")).toBe("Enter a valid email address.");
  });
});

describe("validatePassword", () => {
  it("accepts a password with 8+ chars, a letter and a number", () => {
    expect(validatePassword("password123")).toBeUndefined();
  });

  it("rejects a missing password", () => {
    expect(validatePassword("")).toBe("Password is required.");
  });

  it("rejects a password that is too short", () => {
    expect(validatePassword("short")).toBe("Password must be at least 8 characters.");
  });

  it("rejects a password without a letter", () => {
    expect(validatePassword("12345678")).toBe(
      "Password must contain at least one letter and one number.",
    );
  });

  it("rejects a password without a number", () => {
    expect(validatePassword("abcdefgh")).toBe(
      "Password must contain at least one letter and one number.",
    );
  });
});

describe("validateLoginForm", () => {
  it("returns no errors for valid values", () => {
    expect(validateLoginForm({ email: "user@example.com", password: "password123" })).toEqual({});
  });

  it("reports errors keyed by field", () => {
    const errors = validateLoginForm({ email: "bad", password: "x" });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});

describe("hasErrors", () => {
  it("is false for an empty errors map", () => {
    expect(hasErrors({})).toBe(false);
  });

  it("is true when a field has a message", () => {
    expect(hasErrors({ email: "Email is required." })).toBe(true);
  });
});
