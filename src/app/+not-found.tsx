import { AUTH_DISABLED, useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const href = AUTH_DISABLED ? "/books" : isAuthenticated ? "/favourites" : "/";
  return <Redirect href={href} />;
}
