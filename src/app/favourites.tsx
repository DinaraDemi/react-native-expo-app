import { BookItem } from "@/components/BookItem";
import { FavouritesSkeleton } from "@/components/Skeleton";
import { COLORS } from "@/constants/colors";
import { useFavouritesStore } from "@/store/favouritesStore";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Favourites = () => {
  const favourites = useFavouritesStore((s) => s.favourites);
  const [hydrated, setHydrated] = useState(useFavouritesStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useFavouritesStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <View style={styles.container}>
        <FavouritesSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={favourites}
        renderItem={({ item }) => <BookItem item={item} />}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={COLORS.inactive} />
            <Text style={styles.emptyTitle}>No Favourites Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any book to save it here.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.containerBackground,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptySubtitle: {
    color: COLORS.inactive,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});