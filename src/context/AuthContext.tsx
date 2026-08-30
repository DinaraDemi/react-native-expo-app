import { login as apiLogin } from "@/api/auth";
import { clearToken, getStoredToken, storeToken } from "@/utils/secureStorage";
import { decodeToken, isTokenExpired, userFromTokenClaims } from "@/utils/jwt";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * TEMPORARY kill-switch for the public GitHub Pages demo.
 *
 * When `true`, authorization is switched OFF: the app always behaves as if a
 * user is signed in (no login screen, no hydration splash, no auth backend
 * needed). Waiting for a real backend to be hosted, set this back to `false`
 * to restore the normal login flow.
 */
export const AUTH_DISABLED = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(
    AUTH_DISABLED ? { email: "demo@example.com" } : null,
  );
  const [isHydrating, setIsHydrating] = useState(!AUTH_DISABLED);

  useEffect(() => {
    if (AUTH_DISABLED) return;

    let active = true;

    const hydrate = async () => {
      try {
        const stored = await getStoredToken();
        if (!active || !stored) return;

        const claims = decodeToken(stored);
        if (isTokenExpired(claims)) {
          await clearToken();
          return;
        }
        setToken(stored);
        setUser(userFromTokenClaims(claims));
      } catch {
        await clearToken();
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token: nextToken } = await apiLogin(email, password);
    const claims = decodeToken(nextToken);
    await storeToken(nextToken);
    setToken(nextToken);
    setUser(userFromTokenClaims(claims));
  }, []);

  const signOut = useCallback(async () => {
    await clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: AUTH_DISABLED || token !== null,
      isHydrating: AUTH_DISABLED ? false : isHydrating,
      signIn,
      signOut,
    }),
    [user, token, isHydrating, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};
