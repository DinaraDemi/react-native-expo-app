export interface LoginResponse {
  token: string;
  user: { email: string };
}

const AUTH_API_URL = process.env.EXPO_PUBLIC_AUTH_API_URL;

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  if (!AUTH_API_URL) {
    throw new Error("EXPO_PUBLIC_AUTH_API_URL is not configured in your .env file.");
  }

  const response = await fetch(`${AUTH_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const text = await response.text();
  let data: Partial<LoginResponse & { error?: string }> | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error ?? "Login failed. Please try again.";
    throw new Error(message);
  }

  if (!data || typeof data.token !== "string") {
    throw new Error("The auth server returned an invalid response.");
  }

  return { token: data.token, user: data.user ?? { email } };
};
