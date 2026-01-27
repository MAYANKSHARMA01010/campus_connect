import React, { memo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Surface, Text } from "react-native-paper";
import { Image } from "expo-image";

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

const formatEventDate = (rawDate) => {
  if (!rawDate) return {};

  const date = new Date(rawDate);
  const now = new Date();

  const day = date.toLocaleDateString("en-US", { weekday: "long" });

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = Math.floor(
    (startOfDate - startOfNow) / (1000 * 60 * 60 * 24)
  );

  let startsIn = "";

  if (diffDays === 0) startsIn = "Starts Today";
  else if (diffDays === 1) startsIn = "Starts Tomorrow";
  else if (diffDays > 1) startsIn = `Starts in ${diffDays} days`;
  else startsIn = "Event Passed";

  return { day, formattedDate, time, startsIn };
};

const EventCard = memo(({ item, navigation }) => {
  const colors = useAppTheme();
  const { day, formattedDate, time, startsIn } = formatEventDate(item.date);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => navigation.navigate("EventDetail", { id: item.id })}
    >
      <Surface
        style={[
          styles.cardShadow,
          {
            backgroundColor: colors.surface,
            borderRadius: Radius.lg,
          },
        ]}
      >
        <View style={styles.cardContainer}>
          {item.images?.length ? (
            <Image
              source={item.images[0].url}
              style={styles.cardImage}
              contentFit="cover"
              transition={250}
              cachePolicy="disk"
            />
          ) : (
            <View
              style={[styles.noImageBox, { backgroundColor: colors.border }]}
            >
              <Text style={{ color: colors.muted }}>No Image</Text>
            </View>
          )}

          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              {item.title}
            </Text>

            <Text style={[styles.cardInfo, { color: colors.textSecondary }]}>
              📍 {item.location}
            </Text>

            <View style={styles.dateWrapper}>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                🗓 {formattedDate}
              </Text>

              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                ⏰ {time}
              </Text>

              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                📅 {day}
              </Text>

              <Text style={[styles.startsIn, { color: colors.primary }]}>
                {startsIn}
              </Text>
            </View>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
});

export default EventCard;

const styles = StyleSheet.create({
  cardShadow: {
    margin: Spacing.md,
    ...Shadows.card,
  },

  cardContainer: {
    borderRadius: Radius.lg,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: scale(280),
  },

  noImageBox: {
    height: scale(200),
    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: {
    padding: Spacing.md,
  },

  cardTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
  },

  cardInfo: {
    marginTop: Spacing.xs,
    fontSize: Fonts.size.md,
  },

  dateWrapper: {
    marginTop: Spacing.sm,
  },

  dateText: {
    fontSize: Fonts.size.sm,
    marginVertical: 1,
  },

  startsIn: {
    marginTop: Spacing.xs,
    fontWeight: Fonts.weight.bold,
    fontSize: Fonts.size.md,
  },
});
