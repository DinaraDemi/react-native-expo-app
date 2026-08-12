import { CartModal } from "@/components/CartModal";
import { COLORS } from "@/constants/colors";
import { useCartTotalQuantity } from "@/store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

export const CartButton = () => {
  const [visible, setVisible] = useState(false);
  const totalQuantity = useCartTotalQuantity();

  const badgeScale = useSharedValue(1);
  const prevQuantityRef = useRef(totalQuantity);

  // Spring the badge whenever the cart quantity changes.
  useEffect(() => {
    const prev = prevQuantityRef.current;
    if (prev === totalQuantity) return;

    if (totalQuantity > prev) {
      badgeScale.value = withSequence(
        withSpring(1.45, { damping: 5, stiffness: 280 }),
        withSpring(1, { damping: 10, stiffness: 240 }),
      );
    } else if (totalQuantity > 0) {
      badgeScale.value = withSequence(
        withSpring(0.85, { damping: 12, stiffness: 260 }),
        withSpring(1, { damping: 12, stiffness: 240 }),
      );
    }

    prevQuantityRef.current = totalQuantity;
  }, [totalQuantity, badgeScale]);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.button}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="cart-outline" size={24} color={COLORS.text} />
        {totalQuantity > 0 && (
          <Animated.View style={[styles.badge, badgeAnimatedStyle]}>
            <Text style={styles.badgeText}>{totalQuantity > 99 ? "99+" : totalQuantity}</Text>
          </Animated.View>
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
