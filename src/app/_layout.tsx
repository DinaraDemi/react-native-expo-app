import { COLORS } from "@/constants/colors";
import { FavouritesProvider } from "@/context/FavouritesContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <FavouritesProvider>
      <Tabs screenOptions={
        {
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: COLORS.background
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: { fontWeight: "bold" },
          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.text,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: COLORS.text,
          tabBarInactiveTintColor: COLORS.inactive,
        }
      }>
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="book/[id]" options={{ href: null, title: "Book Details" }} />
        <Tabs.Screen name="music" options={{ title: "Music", tabBarIcon: ({ color, size }) => (<Ionicons name="game-controller" size={size} color={color} />) }} />
        <Tabs.Screen name="books" options={{ title: "Books", tabBarIcon: ({ color, size }) => (<Ionicons name="book" size={size} color={color} />) }} />
        <Tabs.Screen
          name="favourites"
          options={{
            title: "Favourites",
            tabBarIcon: ({ color, size }) => (<Ionicons name="heart" size={size} color={color} />),
          }}
        />
      </Tabs>
    </FavouritesProvider>
  );
}
