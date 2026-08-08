import { COLORS } from "@/constants/colors";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
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
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Reset state when the uri changes (e.g. FlashList cell recycling)
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [uri]);

  if (!uri || failed) {
    return (
      <View style={[styles.placeholder, { width, height, borderRadius }]}>
        <Text style={styles.placeholderText}>{placeholderText}</Text>
      </View>
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