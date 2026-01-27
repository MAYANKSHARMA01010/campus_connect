import React, { memo, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Text, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

const Card = memo(({ item, navigation }) => {
  const colors = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: Radius.lg,
        },
      ]}
      onPress={() => navigation.navigate("EventDetail", { id: item.id })}
    >
      <ImageBackground
        source={{ uri: item.images?.[0]?.url }}
        style={styles.bgImage}
        imageStyle={[styles.bgImageStyle, { borderRadius: Radius.lg }]}
      >
        <View
          style={[
            styles.gradientOverlay,
            { backgroundColor: "rgba(0,0,0,0.35)" },
          ]}
        />

        <View style={styles.overlayContent}>
          <Text
            variant="titleLarge"
            style={[styles.overlayTitle, { color: colors.surface }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text style={[styles.overlayDate, { color: colors.accent }]}>
            {item.date ? new Date(item.date).toDateString() : ""}
          </Text>

          <Text
            style={[styles.overlaySummary, { color: colors.surface }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
});

export default function EventSection({ data }) {
  const navigation = useNavigation();
  const colors = useAppTheme();

  const renderItem = useCallback(
    ({ item }) => <Card item={item} navigation={navigation} />,
    [navigation]
  );

  const renderViewMore = useCallback(
    () => (
      <TouchableOpacity
        style={[
          styles.viewMoreCard,
          {
            borderColor: colors.primary,
            backgroundColor: colors.surface,
            borderRadius: Radius.lg,
          },
        ]}
        onPress={() => navigation.navigate("Events")}
      >
        <Text style={[styles.viewMoreText, { color: colors.primary }]}>
          View More
        </Text>
      </TouchableOpacity>
    ),
    [navigation, colors]
  );

  return (
    <Surface style={styles.section} elevation={0}>
      <FlatList
        horizontal
        data={data.slice(0, 6)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        removeClippedSubviews
        ListFooterComponent={renderViewMore}
        contentContainerStyle={styles.scrollContainer}
      />
    </Surface>
  );
}

const CARD_WIDTH = scale(280);
const CARD_HEIGHT = scale(340);

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },

  scrollContainer: {
    paddingHorizontal: Spacing.lg,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: "hidden",
    marginRight: Spacing.lg,
    ...Shadows.card,
  },

  bgImage: {
    flex: 1,
    justifyContent: "flex-end",
  },

  bgImageStyle: {
    resizeMode: "cover",
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  overlayContent: {
    padding: Spacing.md,
  },

  overlayTitle: {
    fontWeight: Fonts.weight.bold,
    fontSize: Fonts.size.xl,
    marginBottom: Spacing.xs,
  },

  overlayDate: {
    fontSize: Fonts.size.sm,
    marginBottom: Spacing.sm,
  },

  overlaySummary: {
    fontSize: Fonts.size.md,
    opacity: 0.9,
  },

  viewMoreCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: Spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.6,
    ...Shadows.card,
  },

  viewMoreText: {
    fontWeight: Fonts.weight.bold,
    fontSize: Fonts.size.lg,
    letterSpacing: 0.5,
  },
});
