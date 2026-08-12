import { fetchBookDetails } from "@/api/books";
import { BookCover } from "@/components/BookCover";
import { EmptyListComponent } from "@/components/EmptyListComponent";
import { BookDetailsSkeleton } from "@/components/Skeleton";
import { COLORS } from "@/constants/colors";
import { useFavouritesStore } from "@/store/favouritesStore";
import { useCartStore } from "@/store/cartStore";
import { Book } from "@/types/interfaces";
import { getBookCoverUrl } from "@/utils/bookCover";
import { Ionicons } from "@expo/vector-icons";
import { getBookDetailDeepLink } from "@/utils/deepLinks";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Web-only fallback: copy a string to the clipboard when the Web Share API is
 * unavailable (e.g. desktop Chrome/Firefox/Edge, even on localhost).
 */
const copyToClipboard = async (text: string): Promise<void> => {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Legacy fallback for browsers without the async Clipboard API.
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

export default function BookDetailsScreen() {
  const params = useLocalSearchParams<{ id: string; coverId?: string; author?: string; title?: string }>();
  const favourites = useFavouritesStore((s) => s.favourites);
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);
  const addToCart = useCartStore((s) => s.addToCart);
  const cartItems = useCartStore((s) => s.items);

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
  const coverUrl = getBookCoverUrl(
    { cover_id: coverId !== undefined ? Number(coverId) : undefined },
    "L"
  );

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
  const fav = favourites.some((b) => b.key === bookKey);
  const cartQuantity = cartItems.find((i) => i.book.key === bookKey)?.quantity ?? 0;

  const descriptionText = typeof details?.description === "string"
    ? details.description
    : details?.description?.value || "No description available for this book.";

  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const deepLink = getBookDetailDeepLink({
    id: params.id,
    coverId,
    author,
    title,
  });

  const showShareFeedback = (message: string) => {
    setShareFeedback(message);
    setTimeout(() => {
      setShareFeedback((current) => (current === message ? null : current));
    }, 3000);
  };

  const handleShare = async () => {
    if (!params.id) return;
    setShareFeedback(null);

    const message = `Check out this book: ${title} by ${author}`;

    // Web: the Web Share API is only available in some browsers, so fall back to
    // copying the link when it is not supported (desktop Chrome/Firefox/Edge).
    // react-native-web's Alert/Share are unreliable on web, so we handle it here.
    if (Platform.OS === "web") {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          await navigator.share({ title: title || undefined, text: message, url: deepLink });
          return;
        } catch {
          // User cancelled the share sheet (or it failed) — nothing else to do.
          return;
        }
      }

      try {
        await copyToClipboard(deepLink);
        showShareFeedback("Link copied to clipboard");
      } catch {
        showShareFeedback("Couldn't share or copy the link.");
      }
      return;
    }

    try {
      await Share.share({
        message,
        url: deepLink,
        title: title || undefined,
      });
    } catch {
      Alert.alert("Share failed", "Unable to open the share sheet right now.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <BookDetailsSkeleton />
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
          <BookCover
            uri={coverUrl}
            width={150}
            height={225}
            borderRadius={8}
            placeholderText="No Cover Available"
          />

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

          <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(bookForFav)}>
            <Ionicons name="cart-outline" size={24} color={COLORS.text} />
            <Text style={styles.cartText}>
              {cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color={COLORS.text} />
            <Text style={styles.shareText}>Share Book</Text>
          </TouchableOpacity>

          {shareFeedback ? (
            <Text style={styles.shareFeedback}>{shareFeedback}</Text>
          ) : null}
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
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.itemBackground,
  },
  cartText: {
    color: COLORS.text,
    fontSize: 14,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.text,
    backgroundColor: "transparent",
  },
  shareText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  shareFeedback: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: 10,
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
