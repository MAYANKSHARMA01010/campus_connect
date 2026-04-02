import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Appbar, Searchbar, Text, Button, Surface, ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import EventSection from "../components/EventSection";
import { eventAPI } from "../api/api";

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const colors = useAppTheme();
  const isDark = colors.background === "#121212";

  const [searchQuery, setSearchQuery] = React.useState("");
  const [upcoming, setUpcoming] = React.useState([]);
  const [sportsCulture, setSportsCulture] = React.useState([]);
  const [eduTech, setEduTech] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const sortByDate = React.useCallback((arr, asc = true) => {
    return [...arr].sort((a, b) =>
      asc
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  const toDateKey = React.useCallback((value) => {
    if (!value) return null;
    if (typeof value === "string" && value.includes("T")) {
      return value.split("T")[0];
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString().split("T")[0];
  }, []);

  const loadEvents = React.useCallback(async () => {
    try {
      setLoading(true);
      const homeData = await eventAPI.getAll();
      const data = Array.isArray(homeData?.events) ? homeData.events : [];
      const sections = homeData?.sections || {};

      const todayKey = new Date().toISOString().split("T")[0];
      const valid = data.filter((e) => toDateKey(e?.date));

      const upcomingSection = Array.isArray(sections.upcoming)
        ? sections.upcoming
        : [];
      const sportsCultureSection = Array.isArray(sections.sportsCulture)
        ? sections.sportsCulture
        : [];
      const educationTechSection = Array.isArray(sections.educationTech)
        ? sections.educationTech
        : [];

      setUpcoming(
        upcomingSection.length
          ? sortByDate(upcomingSection)
          : sortByDate(
              valid.filter((e) => {
                const eventDateKey = toDateKey(e.date);
                return eventDateKey && eventDateKey >= todayKey;
              })
            )
      );

      setSportsCulture(
        sportsCultureSection.length
          ? sortByDate(sportsCultureSection)
          : sortByDate(
              data.filter((e) =>
                ["sports", "culture"].includes(e.category?.toLowerCase())
              )
            )
      );

      setEduTech(
        educationTechSection.length
          ? sortByDate(educationTechSection)
          : sortByDate(
              data.filter((e) =>
                ["tech", "education", "seminar", "workshop"].includes(
                  e.category?.toLowerCase()
                )
              )
            )
      );
    } catch (_err) {
      // Fail silently
    } finally {
      setLoading(false);
    }
  }, [sortByDate, toDateKey]);

  React.useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const topEvent = upcoming.length > 0 ? upcoming[0] : null;

  const sections = [
    {
      id: "upcoming",
      title: "Coming Up",
      subtitle: "Events happening this month",
      icon: "calendar-clock",
      data: upcoming,
      onViewAll: () => navigation.navigate("Events"),
    },
    {
      id: "sports",
      title: "Sports & Culture",
      subtitle: "Competitions, clubs & fests",
      icon: "soccer",
      data: sportsCulture,
      onViewAll: () => navigation.navigate("Events"),
    },
    {
      id: "tech",
      title: "Learning & Tech",
      subtitle: "Workshops, seminars & talks",
      icon: "laptop",
      data: eduTech,
      onViewAll: () => navigation.navigate("Events"),
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <Appbar.Header
        elevated
        style={[
          styles.header,
          { backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.brandSection}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={28}
              color={colors.primary}
            />
            <Text variant="headlineSmall" style={[styles.brandText, { color: colors.primary }]}>
              Campus
            </Text>
          </View>
        </View>
        <Appbar.Action icon="bell-outline" color={colors.textPrimary} />
      </Appbar.Header>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Find events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPress={() => navigation.navigate("Search")}
          style={[
            styles.searchbar,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Featured Quick Access Card */}
      {!loading && topEvent ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("EventDetail", {
              eventId: topEvent.id,
            })
          }
          style={styles.featuredWrapper}
        >
          <ImageBackground
            source={
              topEvent.imagePath
                ? { uri: topEvent.imagePath }
                : {
                    uri: "https://picsum.photos/seed/event-featured/400/280",
                  }
            }
            style={styles.featuredCard}
            imageStyle={{ borderRadius: Radius.lg }}
          >
            <BlurView intensity={isDark ? 40 : 25} style={styles.blurContainer}>
              <LinearGradient
                colors={[
                  isDark
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.1)",
                  isDark
                    ? "rgba(0, 0, 0, 0.7)"
                    : "rgba(0, 0, 0, 0.4)",
                ]}
                style={styles.gradientOverlay}
              >
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  FEATURED
                </Text>
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {topEvent.title || "Upcoming Event"}
                </Text>
                <Text style={styles.featuredSubtitle} numberOfLines={1}>
                  {new Date(topEvent.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </LinearGradient>
            </BlurView>
          </ImageBackground>
        </TouchableOpacity>
      ) : loading ? (
        <View style={styles.featuredSkeleton}>
          <Surface
            style={[
              styles.featuredSkeletonCard,
              { backgroundColor: colors.border },
            ]}
          />
        </View>
      ) : null}

      {/* Main Sections */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={true}
            size="large"
            color={colors.primary}
          />
        </View>
      ) : (
        sections.map((section) => (
          <EventCategorySection
            key={section.id}
            section={section}
            navigation={navigation}
            colors={colors}
          />
        ))
      )}

      {/* Host Event CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("HostEvent")}
        style={styles.ctaWrapper}
      >
        <ImageBackground
          source={{
            uri: "https://picsum.photos/seed/host-banner/800/280",
          }}
          style={styles.ctaCard}
          imageStyle={{ borderRadius: Radius.lg }}
        >
          <BlurView intensity={isDark ? 35 : 30} style={styles.ctaBlur}>
            <LinearGradient
              colors={[
                isDark
                  ? "rgba(0, 0, 0, 0.4)"
                  : "rgba(255, 255, 255, 0.15)",
                isDark
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(0, 0, 0, 0.5)",
              ]}
              style={styles.ctaGradient}
            >
              <MaterialCommunityIcons
                name="microphone-variant"
                size={44}
                color={colors.primary}
              />
              <Text style={[styles.ctaTitle, { color: "#fff" }]}>
                Host an Event
              </Text>
              <Text style={styles.ctaSubtitle}>
                Share your campus activity
              </Text>
              <Button
                mode="contained"
                style={styles.ctaButton}
                buttonColor={colors.primary}
                contentStyle={styles.ctaButtonContent}
              >
                Create Event
              </Button>
            </LinearGradient>
          </BlurView>
        </ImageBackground>
      </TouchableOpacity>

      {/* About Us Section */}
      <View style={styles.aboutWrapper}>
        <View style={styles.aboutContainer}>
          <View style={styles.aboutIconContainer}>
            <MaterialCommunityIcons
              name="information"
              size={32}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.aboutSectionTitle, { color: colors.primary }]}>
            About CampusConnect
          </Text>
          <Text style={[styles.aboutDescription, { color: colors.textSecondary }]}>
            CampusConnect is your one-stop platform to explore, register, and
            participate in college events — from cultural fests to tech summits.
          </Text>
          <Button
            mode="outlined"
            style={styles.aboutButton}
            labelStyle={[styles.aboutButtonLabel, { color: colors.primary }]}
            onPress={() => navigation.navigate("About")}
          >
            Learn More
          </Button>
        </View>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const EventCategorySection = React.memo(
  ({ section, navigation, colors }) => {
    const hasData = Array.isArray(section.data) && section.data.length > 0;

    if (!hasData) {
      return (
        <View style={styles.emptySection}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={48}
            color={colors.border}
          />
          <Text
            style={[
              styles.emptyText,
              { color: colors.textSecondary, marginTop: Spacing.md },
            ]}
          >
            No {section.title.toLowerCase()} events yet
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderInfo}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={section.icon}
                size={20}
                color="white"
              />
            </View>
            <View style={styles.textGroup}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                {section.title}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                {section.subtitle}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={section.onViewAll}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: Spacing.md }}>
          <EventSection data={section.data} />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: scale(110),
  },

  header: {
    paddingHorizontal: Spacing.lg,
    justifyContent: "space-between",
  },

  headerContent: {
    flex: 1,
  },

  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  brandText: {
    fontWeight: Fonts.weight.bold,
  },

  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  searchbar: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    height: scale(48),
    ...Shadows.card,
  },

  searchInput: {
    fontSize: Fonts.size.sm,
  },

  featuredWrapper: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  featuredCard: {
    height: scale(200),
    borderRadius: Radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
    ...Shadows.card,
  },

  blurContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  gradientOverlay: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "flex-end",
  },

  badgeText: {
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.bold,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },

  featuredTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.bold,
    color: "#fff",
    marginBottom: Spacing.xs,
  },

  featuredSubtitle: {
    fontSize: Fonts.size.sm,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: Fonts.weight.medium,
  },

  featuredSkeleton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  featuredSkeletonCard: {
    height: scale(200),
    borderRadius: Radius.lg,
  },

  sectionWrapper: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionHeaderInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: Radius.md,
    backgroundColor: "#5E7CE2",
    justifyContent: "center",
    alignItems: "center",
  },

  textGroup: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
  },

  sectionSubtitle: {
    fontSize: Fonts.size.xs,
    marginTop: 2,
  },

  emptySection: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
    paddingVertical: scale(40),
    alignItems: "center",
  },

  emptyText: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.medium,
  },

  ctaWrapper: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  ctaCard: {
    height: scale(200),
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadows.card,
  },

  ctaBlur: {
    flex: 1,
  },

  ctaGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },

  ctaTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.bold,
    marginTop: Spacing.md,
  },

  ctaSubtitle: {
    fontSize: Fonts.size.sm,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },

  ctaButton: {
    borderRadius: Radius.md,
    minWidth: scale(120),
  },

  ctaButtonContent: {
    paddingVertical: Spacing.xs,
  },

  loadingContainer: {
    paddingVertical: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },

  aboutWrapper: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  aboutContainer: {
    backgroundColor: "rgba(94, 124, 226, 0.08)",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(94, 124, 226, 0.2)",
  },

  aboutIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: Radius.md,
    backgroundColor: "rgba(94, 124, 226, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  aboutSectionTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
    marginBottom: Spacing.sm,
  },

  aboutDescription: {
    fontSize: Fonts.size.sm,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },

  aboutButton: {
    borderRadius: Radius.md,
    borderWidth: 2,
    minWidth: scale(140),
  },

  aboutButtonLabel: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
  },
});
