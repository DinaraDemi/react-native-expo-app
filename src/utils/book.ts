import { Book } from "@/types/interfaces";

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

export const buildBookFromDetailMeta = ({ id, title, author, coverId }: BookDetailMeta): Book => ({
  key: `/works/${id}`,
  title,
  ...(author ? { author_name: [author] } : {}),
  ...(coverId !== undefined && coverId !== "" ? { cover_id: Number(coverId) } : {}),
});
