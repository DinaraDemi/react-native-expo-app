import { BooksScreen } from "@/components/BooksScreen";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function PublicIndex() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/favourites" />;
  }

  return <BooksScreen />;
}
