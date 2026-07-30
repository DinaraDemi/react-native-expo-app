import { COLORS } from "@/constants/colors";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface EmptyListComponentProps {
  isLoading: boolean;
  message?: string;
}

export const EmptyListComponent = ({
  isLoading,
  message = "No items found",
}: EmptyListComponentProps) => {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.text} />
      ) : (
        <Text style={styles.text}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
  },
});
