import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

import { useAppTheme } from "../theme/useAppTheme";
import { Radius, Spacing } from "../theme/theme";
import { scale } from "../theme/layout";

const SkeletonBlock = ({ height, width = "100%", style }) => {
  const colors = useAppTheme();
  return (
    <Surface
      elevation={0}
      style={[
        {
          height,
          width,
          borderRadius: Radius.md,
          backgroundColor: colors.border,
        },
        style,
      ]}
    />
  );
};

export function ListSkeleton({ count = 3 }) {
  return (
    <View style={styles.listWrap}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={`list-skeleton-${index}`} style={styles.listItem}>
          <SkeletonBlock height={scale(210)} />
          <SkeletonBlock height={scale(24)} style={styles.spaceTop} />
          <SkeletonBlock height={scale(16)} width="65%" style={styles.spaceTopSm} />
        </View>
      ))}
    </View>
  );
}

export function DetailSkeleton() {
  return (
    <View style={styles.detailWrap}>
      <SkeletonBlock height={scale(280)} style={styles.hero} />
      <SkeletonBlock height={scale(34)} width="70%" style={styles.spaceTop} />
      <SkeletonBlock height={scale(18)} width="45%" style={styles.spaceTopSm} />
      <SkeletonBlock height={scale(100)} style={styles.spaceTop} />
      <SkeletonBlock height={scale(140)} style={styles.spaceTop} />
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={styles.homeWrap}>
      <SkeletonBlock height={scale(170)} style={styles.spaceTop} />
      <SkeletonBlock height={scale(24)} width="40%" style={styles.spaceTop} />
      <SkeletonBlock height={scale(260)} style={styles.spaceTopSm} />
      <SkeletonBlock height={scale(24)} width="45%" style={styles.spaceTop} />
      <SkeletonBlock height={scale(260)} style={styles.spaceTopSm} />
    </View>
  );
}

const styles = StyleSheet.create({
  listWrap: {
    padding: Spacing.md,
  },
  listItem: {
    marginBottom: Spacing.md,
  },
  detailWrap: {
    paddingBottom: Spacing.xl,
  },
  homeWrap: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  hero: {
    borderRadius: 0,
  },
  spaceTop: {
    marginTop: Spacing.md,
  },
  spaceTopSm: {
    marginTop: Spacing.sm,
  },
});