import { Book } from "@/types/interfaces";

/**
 * Best-effort author display name from the shapes the OpenLibrary API can
 * return (full `authors` array in search results vs plain `author_name`).
 */
export const getBookAuthorName = (
  book: Pick<Book, "authors" | "author_name">
): string => {
  return (
    book.authors?.map((a) => a.name).join(", ") ||
    book.author_name?.join(", ") ||
    "Unknown Author"
  );
};