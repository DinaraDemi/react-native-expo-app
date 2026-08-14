import { COLORS } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const logout = useAuthStore((s) => s.logout);

  const handlePress = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel="Sign out"
    >
      <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
    padding: 4,
  },
});
