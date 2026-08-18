import { COLORS } from "@/constants/colors";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(drawer)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

function AppNavigator() {
  const { isHydrating } = useAuth();

  if (isHydrating) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={COLORS.text} />
      </View>
    );
  }

  return <RootNavigator />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
});
