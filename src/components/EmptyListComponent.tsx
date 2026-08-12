import { COLORS } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface EmptyListComponentProps {
  message?: string;
}

export const EmptyListComponent = ({
  message = "No items found",
}: EmptyListComponentProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
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
