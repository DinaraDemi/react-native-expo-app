import { login } from "@/api/auth";

const jsonResponse = (body: unknown, ok = true) =>
  ({
    ok,
    status: ok ? 200 : 401,
    text: async () => JSON.stringify(body),
  }) as unknown as Response;

describe("login", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it("returns the token and user on success", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ token: "aaa.bbb.ccc", user: { email: "a@b.com" } }),
    );
    const result = await login("a@b.com", "pw123456");
    expect(result.token).toBe("aaa.bbb.ccc");
    expect(result.user.email).toBe("a@b.com");
  });

  it("posts the email and password to the auth endpoint", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ token: "t", user: { email: "me@x.com" } }));
    await login("me@x.com", "secret1");
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "me@x.com", password: "secret1" }),
    });
  });

  it("throws the server error message on failure", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ error: "Invalid email or password." }, false));
    await expect(login("a@b.com", "wrong")).rejects.toThrow("Invalid email or password.");
  });

  it("throws when the response has no token", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ user: { email: "a@b.com" } }));
    await expect(login("a@b.com", "pw123456")).rejects.toThrow(
      "The auth server returned an invalid response.",
    );
  });
});
