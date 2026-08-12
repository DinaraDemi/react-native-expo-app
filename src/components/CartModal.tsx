import { BookCover } from "@/components/BookCover";
import { COLORS } from "@/constants/colors";
import { useCartStore } from "@/store/cartStore";
import { getBookAuthorName } from "@/utils/book";
import { getBookCoverUrl } from "@/utils/bookCover";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable, {
  SwipeDirection,
} from "react-native-gesture-handler/ReanimatedSwipeable";

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CartModal = ({ visible, onClose }: CartModalProps) => {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Cart</Text>
            <Text style={styles.headerCount}>
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={64} color={COLORS.inactive} />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySubtitle}>Add books from the book details page.</Text>
            </View>
          ) : (
            <FlashList
              data={items}
              keyExtractor={(item) => item.book.key}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const coverUrl = getBookCoverUrl(item.book, "S");
                const authorNames = getBookAuthorName(item.book);

                return (
                  <ReanimatedSwipeable
                    friction={2}
                    rightThreshold={40}
                    overshootRight={false}
                    renderRightActions={() => (
                      <TouchableOpacity
                        style={styles.deleteAction}
                        onPress={() => removeFromCart(item.book.key)}
                      >
                        <Ionicons name="trash" size={22} color="#fff" />
                        <Text style={styles.deleteActionText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                    onSwipeableOpen={(direction) => {
                      if (direction === SwipeDirection.RIGHT) {
                        removeFromCart(item.book.key);
                      }
                    }}
                  >
                    <View style={styles.itemRow}>
                      <BookCover uri={coverUrl} width={40} height={60} borderRadius={4} />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle} numberOfLines={2}>
                          {item.book.title}
                        </Text>
                        <Text style={styles.itemAuthor} numberOfLines={1}>
                          {authorNames}
                        </Text>
                      </View>

                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.book.key, item.quantity - 1)}
                          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                        >
                          <Ionicons name="remove" size={16} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.book.key, item.quantity + 1)}
                          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                        >
                          <Ionicons name="add" size={16} color={COLORS.text} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeFromCart(item.book.key)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="trash-outline" size={20} color={COLORS.favourite} />
                      </TouchableOpacity>
                    </View>
                  </ReanimatedSwipeable>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  sheet: {
    backgroundColor: COLORS.containerBackground,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
    minHeight: 300,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.itemBackground,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  headerCount: {
    color: COLORS.inactive,
    fontSize: 14,
    marginRight: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  emptySubtitle: {
    color: COLORS.inactive,
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.itemBackground,
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  itemAuthor: {
    color: COLORS.inactive,
    fontSize: 12,
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  deleteButton: {
    padding: 4,
  },
  deleteAction: {
    width: 90,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.favourite,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  deleteActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});