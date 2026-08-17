import { fetchBooks, fetchBookDetails, OpenLibraryError } from "@/api/books";

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as unknown as Response;

describe("books api", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it("fetchBooks returns the list of works", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ works: [{ key: "/works/OL1W", title: "T" }] }));
    const books = await fetchBooks();
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe("T");
  });

  it("fetchBooks returns an empty array when there are no works", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));
    expect(await fetchBooks()).toEqual([]);
  });

  it("fetchBookDetails returns the details", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ key: "/works/OL1W", title: "T", subjects: ["a"] }),
    );
    const details = await fetchBookDetails("OL1W");
    expect(details.title).toBe("T");
    expect(details.subjects).toEqual(["a"]);
  });

  it("throws an OpenLibraryError on a failed request", async () => {
    mockFetch.mockResolvedValue(jsonResponse({}, 500));
    await expect(fetchBooks()).rejects.toBeInstanceOf(OpenLibraryError);
    await expect(fetchBooks()).rejects.toThrow("OpenLibrary request failed (500)");
  });
});
