import { EmptyListComponent } from "@/components/EmptyListComponent";
import { COLORS } from "@/constants/colors";
import { useFavouritesContext } from "@/context/FavouritesContext";
import { Book, BookDetails } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const fetchBookDetails = async (id: string): Promise<BookDetails> => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/works/${id}.json`);
  if (!response.ok) throw new Error("Failed to fetch details");
  return response.json();
};

export default function BookDetailsScreen() {
  const params = useLocalSearchParams<{ id: string; coverId?: string; author?: string; title?: string }>();
  const { isFavourite, toggleFavourite } = useFavouritesContext();

  const {
    data: details,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookDetails", params.id],
    queryFn: () => fetchBookDetails(params.id),
    enabled: !!params.id,
  });

  const coverId = params.coverId || details?.covers?.[0];
  const coverUrl = coverId
    ? `${process.env.EXPO_PUBLIC_COVERS_API_URL}/b/id/${coverId}-L.jpg`
    : null;

  const title = details?.title || params.title || "Book Details";
  const author = params.author || "Unknown Author";

  // Reconstruct a minimal Book object for the favourites hook
  const bookKey = `/works/${params.id}`;
  const bookForFav: Book = {
    key: bookKey,
    title: title,
    author_name: [author],
    cover_id: coverId ? Number(coverId) : undefined,
  };
  const fav = isFavourite(bookKey);

  const descriptionText = typeof details?.description === "string"
    ? details.description
    : details?.description?.value || "No description available for this book.";

  if (isLoading) {
    return (
      <View style={styles.container}>
        <EmptyListComponent isLoading={true} />
      </View>
    );
  }

  if (error || (!isLoading && !details)) {
    return (
      <View style={styles.container}>
        <EmptyListComponent isLoading={false} message={error ? "Failed to load book details" : "Book not found"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.cover} resizeMode="cover" />
          ) : (
            <View style={[styles.cover, styles.placeholder]}>
              <Text style={styles.placeholderText}>No Cover Available</Text>
            </View>
          )}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{author}</Text>

          <TouchableOpacity style={styles.favButton} onPress={() => toggleFavourite(bookForFav)}>
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={24}
              color={fav ? COLORS.favourite : COLORS.inactive}
            />
            <Text style={[styles.favText, fav && styles.favTextActive]}>
              {fav ? "Remove from Favourites" : "Add to Favourites"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{descriptionText}</Text>
        </View>

        {details?.subjects && details.subjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <View style={styles.badgeContainer}>
              {details.subjects.slice(0, 8).map((subject, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{subject}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.containerBackground,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  cover: {
    width: 150,
    height: 225,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholder: {
    backgroundColor: COLORS.itemBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: COLORS.inactive,
    fontSize: 14,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  author: {
    color: COLORS.inactive,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  favButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.itemBackground,
  },
  favText: {
    color: COLORS.inactive,
    fontSize: 14,
  },
  favTextActive: {
    color: COLORS.favourite,
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.itemBackground,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  badge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 12,
  },
});
