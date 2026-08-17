import { getBookCoverUrl } from "@/utils/bookCover";

const BASE = process.env.EXPO_PUBLIC_COVERS_API_URL;

describe("getBookCoverUrl", () => {
  it("returns null when there is no cover id", () => {
    expect(getBookCoverUrl({}, "M")).toBeNull();
  });

  it("falls back to cover_i when cover_id is absent", () => {
    expect(getBookCoverUrl({ cover_i: 7 }, "M")).toBe(`${BASE}/b/id/7-M.jpg`);
  });

  it("prefers cover_id when both are present", () => {
    expect(getBookCoverUrl({ cover_id: 1, cover_i: 2 }, "L")).toBe(`${BASE}/b/id/1-L.jpg`);
  });

  it("defaults to the M size when size is omitted", () => {
    expect(getBookCoverUrl({ cover_id: 3 })).toBe(`${BASE}/b/id/3-M.jpg`);
  });
});
