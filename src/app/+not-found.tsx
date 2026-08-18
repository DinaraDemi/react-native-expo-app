import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  return <Redirect href={isAuthenticated ? "/favourites" : "/"} />;
}
