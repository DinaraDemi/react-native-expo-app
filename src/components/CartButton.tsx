import { CartModal } from "@/components/CartModal";
import { COLORS } from "@/constants/colors";
import { useCartTotalQuantity } from "@/store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const CartButton = () => {
  const [visible, setVisible] = useState(false);
  const totalQuantity = useCartTotalQuantity();

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.button}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="cart-outline" size={24} color={COLORS.text} />
        {totalQuantity > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {totalQuantity > 99 ? "99+" : totalQuantity}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <CartModal visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.favourite,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});