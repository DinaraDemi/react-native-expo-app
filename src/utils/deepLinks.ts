import * as Linking from "expo-linking";

export interface BookDeepLinkParams {
  id: string;
  coverId?: string | number;
  author?: string;
  title?: string;
}

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
