import * as Linking from "expo-linking";
import { getBookDetailDeepLink } from "@/utils/deepLinks";

jest.mock("expo-linking", () => ({ createURL: jest.fn() }));

const createURL = Linking.createURL as jest.Mock;

beforeEach(() => {
  createURL.mockClear();
  createURL.mockReturnValue("myapp:///book/OL123W");
});

describe("getBookDetailDeepLink", () => {
  it("builds the book path and converts a numeric coverId to a string", () => {
    getBookDetailDeepLink({ id: "OL123W", coverId: 42 });
    expect(createURL).toHaveBeenCalledWith("/book/OL123W", {
      queryParams: { coverId: "42", author: undefined, title: undefined },
    });
  });

  it("passes through the optional author and title", () => {
    getBookDetailDeepLink({ id: "OL123W", author: "John Doe", title: "My Book" });
    expect(createURL).toHaveBeenCalledWith("/book/OL123W", {
      queryParams: { coverId: undefined, author: "John Doe", title: "My Book" },
    });
  });
});
