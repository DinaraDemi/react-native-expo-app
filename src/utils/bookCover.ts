import { Book } from "@/types/interfaces";

export const getBookCoverUrl = (
  book: Pick<Book, "cover_id" | "cover_i">,
  size: "S" | "M" | "L" = "M",
): string | null => {
  const coverId = book.cover_id || book.cover_i;
  if (!coverId) return null;
  return `${process.env.EXPO_PUBLIC_COVERS_API_URL}/b/id/${coverId}-${size}.jpg`;
};
