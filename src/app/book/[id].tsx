import { EmptyListComponent } from "@/components/EmptyListComponent";
import { COLORS } from "@/constants/colors";
import { BookDetails } from "@/types/interfaces";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function BookDetailsScreen() {
  const params = useLocalSearchParams<{ id: string; coverId?: string; author?: string; title?: string }>();
  const [details, setDetails] = useState<BookDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!params.id) return;

    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`https://openlibrary.org/works/${params.id}.json`);
        if (!response.ok) throw new Error("Failed to fetch details");
        const data: BookDetails = await response.json();
        setDetails(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load book details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [params.id]);

  const coverId = params.coverId || details?.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  const title = details?.title || params.title || "Book Details";
  const author = params.author || "Unknown Author";

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

  if (error || !details) {
    return (
      <View style={styles.container}>
        <EmptyListComponent isLoading={false} message={error || "Book not found"} />
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{descriptionText}</Text>
        </View>

        {details.subjects && details.subjects.length > 0 && (
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
