import { COLORS } from "@/constants/colors";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const PublicLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Books",
          headerRight: () => (
            <Link href="/login" asChild>
              <TouchableOpacity
                style={styles.signInButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
    </Stack>
  );
};

export default PublicLayout;

const styles = StyleSheet.create({
  signInButton: {
    padding: 4,
  },
  signInText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },
});
