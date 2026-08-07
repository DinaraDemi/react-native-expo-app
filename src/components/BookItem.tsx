import { COLORS } from "@/constants/colors";
import { useFavouritesContext } from "@/context/FavouritesContext";
import { Book } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BookItemProps {
  item: Book;
}

export const BookItem = ({ item }: BookItemProps) => {
  const { favourites, toggleFavourite } = useFavouritesContext();
  const fav = favourites.some((b) => b.key === item.key);

  const coverId = item.cover_id || item.cover_i;
  const coverUrl = coverId
    ? `${process.env.EXPO_PUBLIC_COVERS_API_URL}/b/id/${coverId}-M.jpg`
    : null;

  const authorNames =
    item.authors?.map((a) => a.name).join(", ") ||
    item.author_name?.join(", ") ||
    "Unknown Author";

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
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Cover</Text>
        </View>
      )}

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
  cover: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  placeholder: {
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: COLORS.inactive,
    fontSize: 10,
    textAlign: "center",
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
