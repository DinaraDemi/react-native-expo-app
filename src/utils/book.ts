import { Book } from "@/types/interfaces";

/**
 * Best-effort author display name from the shapes the OpenLibrary API can
 * return (full `authors` array in search results vs plain `author_name`).
 */
export const getBookAuthorName = (book: Pick<Book, "authors" | "author_name">): string => {
  return (
    book.authors?.map((a) => a.name).join(", ") || book.author_name?.join(", ") || "Unknown Author"
  );
};

export interface BookDetailMeta {
  id: string;
  title: string;
  author?: string;
  coverId?: string | number;
}

/**
 * Reconstructs a minimal `Book` from the params available on the detail
 * screen (own params or the fetched details) so that books saved to
 * favourites/cart from the detail page share the same shape as books saved
 * from the list. Optional fields are only included when actually known, so
 * the persisted records stay truthful.
 */
export const buildBookFromDetailMeta = ({ id, title, author, coverId }: BookDetailMeta): Book => ({
  key: `/works/${id}`,
  title,
  ...(author ? { author_name: [author] } : {}),
  ...(coverId !== undefined && coverId !== "" ? { cover_id: Number(coverId) } : {}),
});
