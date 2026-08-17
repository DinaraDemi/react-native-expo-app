import { buildBookFromDetailMeta, getBookAuthorName } from "@/utils/book";

describe("getBookAuthorName", () => {
  it("joins names from the authors array", () => {
    const authors = [
      { key: "/a/1", name: "Alice" },
      { key: "/a/2", name: "Bob" },
    ];
    expect(getBookAuthorName({ authors })).toBe("Alice, Bob");
  });

  it("falls back to author_name", () => {
    expect(getBookAuthorName({ author_name: ["Carol"] })).toBe("Carol");
  });

  it("prefers authors over author_name", () => {
    expect(
      getBookAuthorName({
        authors: [{ key: "/a/1", name: "Alice" }],
        author_name: ["Carol"],
      }),
    ).toBe("Alice");
  });

  it("returns the fallback when there are no authors", () => {
    expect(getBookAuthorName({})).toBe("Unknown Author");
  });
});

describe("buildBookFromDetailMeta", () => {
  it("builds a minimal book keyed by the work id", () => {
    expect(buildBookFromDetailMeta({ id: "OL123W", title: "My Book" })).toEqual({
      key: "/works/OL123W",
      title: "My Book",
    });
  });

  it("includes the author when provided", () => {
    expect(buildBookFromDetailMeta({ id: "OL123W", title: "My Book", author: "Alice" })).toEqual({
      key: "/works/OL123W",
      title: "My Book",
      author_name: ["Alice"],
    });
  });

  it("includes the cover id when provided", () => {
    expect(buildBookFromDetailMeta({ id: "OL123W", title: "T", coverId: "42" })).toEqual({
      key: "/works/OL123W",
      title: "T",
      cover_id: 42,
    });
  });

  it("omits the cover id when it is an empty string", () => {
    expect(buildBookFromDetailMeta({ id: "OL123W", title: "T", coverId: "" })).toEqual({
      key: "/works/OL123W",
      title: "T",
    });
  });
});
