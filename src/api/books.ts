import { Book, SubjectsApiResponse, BookDetails } from "@/types/interfaces";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class OpenLibraryError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "OpenLibraryError";
    this.status = status;
  }
}

const request = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new OpenLibraryError(
      `OpenLibrary request failed (${response.status})`,
      response.status
    );
  }
  return response.json() as T;
};

export const fetchBooks = async (): Promise<Book[]> => {
  const data = await request<SubjectsApiResponse>(`${API_URL}/subjects/detective.json`);
  return data.works ?? [];
};

export const fetchBookDetails = async (id: string): Promise<BookDetails> => {
  return request<BookDetails>(`${API_URL}/works/${id}.json`);
};