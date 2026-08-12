import * as Linking from "expo-linking";

export interface BookDeepLinkParams {
  id: string;
  coverId?: string | number;
  author?: string;
  title?: string;
}

/**
 * Builds a deep link to the book detail page, e.g.
 *   myapp:///book/OL12345W?coverId=123&author=John%20Doe&title=My%20Book
 *
 * Uses `Linking.createURL` so the link adapts to the environment:
 *   - Dev/Production native builds:   myapp:///book/<id>...
 *   - Web:                            https://<origin>/book/<id>...
 *   - Expo Go (dev):                  exp://<host>/--/book/<id>...
 *
 * Query parameters are URL-encoded automatically.
 */
export const getBookDetailDeepLink = ({
  id,
  coverId,
  author,
  title,
}: BookDeepLinkParams): string => {
  return Linking.createURL(`/book/${id}`, {
    queryParams: {
      coverId: coverId !== undefined ? String(coverId) : undefined,
      author,
      title,
    },
  });
};
