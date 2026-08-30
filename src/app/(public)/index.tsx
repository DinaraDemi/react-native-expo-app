import { BooksScreen } from "@/components/BooksScreen";
import { AUTH_DISABLED, useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function PublicIndex() {
  const { isAuthenticated } = useAuth();

  // Temporary: with auth disabled, land straight on the full Books list
  // (drawer layout) instead of the login-gated favourites route.
  if (AUTH_DISABLED) {
    return <Redirect href="/books" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/favourites" />;
  }

  return <BooksScreen />;
}
