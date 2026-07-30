import { COLORS } from "@/constants/colors";
import { Book } from "@/types/interfaces";
import { Image, StyleSheet, Text, View } from "react-native";

interface BookItemProps {
  item: Book;
}

export const BookItem = ({ item }: BookItemProps) => {
  const coverId = item.cover_id || item.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  const authorNames =
    item.authors?.map((a) => a.name).join(", ") ||
    item.author_name?.join(", ") ||
    "Unknown Author";

  return (
    <View style={styles.card}>
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
    </View>
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
});
