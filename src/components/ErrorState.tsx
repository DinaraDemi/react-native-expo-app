import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={COLORS.inactive} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
          <Ionicons name="refresh" size={18} color={COLORS.text} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  message: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  retryText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
});
