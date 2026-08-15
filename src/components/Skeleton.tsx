import { COLORS } from "@/constants/colors";
import { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const BASE_COLOR = "#2A2A2A";
const HIGHLIGHT_COLOR = "rgba(255, 255, 255, 0.08)";

interface SkeletonBlockProps {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

export const SkeletonBlock = ({
  width = "100%",
  height = 16,
  borderRadius = 6,
  style,
}: SkeletonBlockProps) => {
  return (
    <ShimmerContainer style={style}>
      <Animated.View style={[styles.block, { width, height, borderRadius }]} />
    </ShimmerContainer>
  );
};

const ShimmerContainer = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [-220, 420]) }],
  }));

  return (
    <Animated.View style={[styles.shimmerContainer, style]}>
      <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
      {children}
    </Animated.View>
  );
};

const SKELETON_COUNT = 6;

export const BookListSkeleton = () => {
  return (
    <Animated.View style={styles.listSkeleton}>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <View key={index} style={styles.itemSkeleton}>
          <SkeletonBlock width={60} height={90} borderRadius={4} />
          <View style={styles.itemInfo}>
            <SkeletonBlock width="90%" height={16} />
            <SkeletonBlock width="60%" height={12} />
            <SkeletonBlock width="30%" height={12} />
          </View>
          <SkeletonBlock width={22} height={22} borderRadius={22} />
        </View>
      ))}
    </Animated.View>
  );
};

export const BookDetailsSkeleton = () => {
  return (
    <Animated.View style={styles.detailsSkeleton}>
      <View style={styles.detailsHeader}>
        <SkeletonBlock width={150} height={225} borderRadius={8} />
        <SkeletonBlock width="70%" height={22} style={{ marginTop: 16 }} />
        <SkeletonBlock width="40%" height={16} style={{ marginTop: 6 }} />
        <SkeletonBlock width="55%" height={36} borderRadius={20} style={{ marginTop: 16 }} />
      </View>
      <View style={styles.detailsSection}>
        <SkeletonBlock width="40%" height={16} />
        <SkeletonBlock width="100%" height={12} style={{ marginTop: 12 }} />
        <SkeletonBlock width="95%" height={12} style={{ marginTop: 8 }} />
        <SkeletonBlock width="80%" height={12} style={{ marginTop: 8 }} />
      </View>
      <View style={styles.detailsSection}>
        <SkeletonBlock width="35%" height={16} />
        <View style={styles.badgeRow}>
          <SkeletonBlock width={90} height={26} borderRadius={13} />
          <SkeletonBlock width={100} height={26} borderRadius={13} />
          <SkeletonBlock width={80} height={26} borderRadius={13} />
        </View>
      </View>
    </Animated.View>
  );
};

export const FavouritesSkeleton = () => {
  return (
    <Animated.View style={styles.favouritesSkeleton}>
      <SkeletonBlock width={64} height={64} borderRadius={64} />
      <SkeletonBlock width="60%" height={20} style={{ marginTop: 16 }} />
      <SkeletonBlock width="80%" height={14} style={{ marginTop: 8 }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: BASE_COLOR,
  },
  shimmerContainer: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: BASE_COLOR,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 120,
    backgroundColor: HIGHLIGHT_COLOR,
  },
  listSkeleton: {
    paddingVertical: 6,
  },
  itemSkeleton: {
    flexDirection: "row",
    backgroundColor: COLORS.itemBackground,
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },
  detailsSkeleton: {
    padding: 20,
  },
  detailsHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 24,
    backgroundColor: COLORS.itemBackground,
    padding: 16,
    borderRadius: 8,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  favouritesSkeleton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120,
    paddingHorizontal: 32,
  },
});
