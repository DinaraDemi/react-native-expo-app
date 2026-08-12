import { BookCover } from "@/components/BookCover";
import { COLORS } from "@/constants/colors";
import { useFavouritesStore } from "@/store/favouritesStore";
import { Book } from "@/types/interfaces";
import { getBookAuthorName } from "@/utils/book";
import { getBookCoverUrl } from "@/utils/bookCover";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BookItemProps {
  item: Book;
}

export const BookItem = ({ item }: BookItemProps) => {
  const favourites = useFavouritesStore((s) => s.favourites);
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);
  const fav = favourites.some((b) => b.key === item.key);

  const coverId = item.cover_id || item.cover_i;
  const coverUrl = getBookCoverUrl(item, "M");
  const authorNames = getBookAuthorName(item);

  const handlePress = () => {
    const workId = item.key.split("/").pop() || item.key;
    router.push({
      pathname: "/book/[id]",
      params: {
        id: workId,
        coverId: coverId ? String(coverId) : "",
        author: authorNames,
        title: item.title,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <BookCover uri={coverUrl} width={60} height={90} borderRadius={4} />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {authorNames}
        </Text>
        {item.first_publish_year ? (
          <Text style={styles.year}>{item.first_publish_year}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => toggleFavourite(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={fav ? "heart" : "heart-outline"}
          size={22}
          color={fav ? COLORS.favourite : COLORS.inactive}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.itemBackground,
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    color: COLORS.inactive,
    fontSize: 14,
    marginBottom: 4,
  },
  year: {
    color: COLORS.inactive,
    fontSize: 12,
  },
  heartButton: {
    padding: 4,
  },
});
