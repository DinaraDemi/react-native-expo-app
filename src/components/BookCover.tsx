import { COLORS } from "@/constants/colors";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SkeletonBlock } from "./Skeleton";

interface BookCoverProps {
  uri: string | null;
  width: number;
  height: number;
  borderRadius?: number;
  placeholderText?: string;
}

export const BookCover = ({
  uri,
  width,
  height,
  borderRadius = 4,
  placeholderText = "No Cover",
}: BookCoverProps) => {
  // Keying by `uri` remounts the inner component whenever the url changes (e.g.
  // FlashList cell recycling), so image load state resets without any effect.
  if (!uri) {
    return (
      <Placeholder
        width={width}
        height={height}
        borderRadius={borderRadius}
        text={placeholderText}
      />
    );
  }

  return (
    <CoverImage
      key={uri}
      uri={uri}
      width={width}
      height={height}
      borderRadius={borderRadius}
      placeholderText={placeholderText}
    />
  );
};

interface CoverImageProps {
  uri: string;
  width: number;
  height: number;
  borderRadius: number;
  placeholderText: string;
}

const CoverImage = ({
  uri,
  width,
  height,
  borderRadius,
  placeholderText,
}: CoverImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <Placeholder
        width={width}
        height={height}
        borderRadius={borderRadius}
        text={placeholderText}
      />
    );
  }

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      {!loaded && (
        <SkeletonBlock width="100%" height="100%" borderRadius={borderRadius} />
      )}
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={250}
        recyclingKey={uri}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </View>
  );
};

interface PlaceholderProps {
  width: number;
  height: number;
  borderRadius: number;
  text: string;
}

const Placeholder = ({ width, height, borderRadius, text }: PlaceholderProps) => {
  return (
    <View style={[styles.placeholder, { width, height, borderRadius }]}>
      <Text style={styles.placeholderText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#2A2A2A",
  },
  placeholder: {
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: COLORS.inactive,
    fontSize: 10,
    textAlign: "center",
  },
});