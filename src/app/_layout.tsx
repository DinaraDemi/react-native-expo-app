import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
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
      <Tabs.Screen name="movies" options={{ title: "Movies", tabBarIcon: ({ color, size }) => (<Ionicons name="videocam" size={size} color={color} />) }} />
      <Tabs.Screen name="music" options={{ title: "Music", tabBarIcon: ({ color, size }) => (<Ionicons name="game-controller" size={size} color={color} />) }} />
    </Tabs>
  );
}
