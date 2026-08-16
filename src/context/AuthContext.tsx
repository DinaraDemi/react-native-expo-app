import { login as apiLogin } from "@/api/auth";
import { clearToken, getStoredToken, storeToken } from "@/utils/secureStorage";
import { jwtDecode } from "jwt-decode";
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

interface JwtClaims {
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
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

const userFromClaims = (claims: JwtClaims): AuthUser => ({
  email: claims.email || claims.sub || "unknown",
});

const isExpired = (claims: JwtClaims): boolean =>
  typeof claims.exp === "number" && claims.exp * 1000 <= Date.now();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      try {
        const stored = await getStoredToken();
        if (!active || !stored) return;

        const claims = jwtDecode<JwtClaims>(stored);
        if (isExpired(claims)) {
          await clearToken();
          return;
        }
        setToken(stored);
        setUser(userFromClaims(claims));
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
    const claims = jwtDecode<JwtClaims>(nextToken);
    await storeToken(nextToken);
    setToken(nextToken);
    setUser(userFromClaims(claims));
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
      isAuthenticated: token !== null,
      isHydrating,
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
