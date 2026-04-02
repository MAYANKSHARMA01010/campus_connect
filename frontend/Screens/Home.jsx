import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Appbar, Searchbar, Text, Button, Surface } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import EventSection from "../components/EventSection";
import { eventAPI } from "../api/api";

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

export default function HomeScreen({ navigation }) {
  const colors = useAppTheme();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [upcoming, setUpcoming] = React.useState([]);
  const [past, setPast] = React.useState([]);
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
      const pastSection = Array.isArray(sections.past) ? sections.past : [];
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

      setPast(
        pastSection.length
          ? sortByDate(pastSection, false)
          : sortByDate(
              valid.filter((e) => {
                const eventDateKey = toDateKey(e.date);
                return eventDateKey && eventDateKey < todayKey;
              }),
              false
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
      // Keep UI resilient if home data fetch fails; sections render empty state.
    } finally {
      setLoading(false);
    }
  }, [sortByDate, toDateKey]);

  React.useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const sectionConfigs = [
    { title: "🎉 Coming Up!", data: upcoming },
    { title: "🕒 The Past Ones", data: past },
    { title: "🏅 Sports & Culture", data: sportsCulture },
    { title: "💡 Education & Tech", data: eduTech },
  ];

  const visibleSections = loading
    ? sectionConfigs
    : sectionConfigs.filter(
        (section) => Array.isArray(section.data) && section.data.length > 0
      );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Appbar.Header
        elevated
        style={[styles.appbar, { backgroundColor: colors.surface }]}
      >
        <Text
          variant="headlineSmall"
          style={[styles.appName, { color: colors.primary }]}
        >
          CampusConnect
        </Text>

        <Appbar.Action icon="bell-outline" color={colors.textPrimary} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search events, workshops, fests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPress={() => {
            navigation.navigate("Search");
          }}
          style={[
            styles.searchbar,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        />
      </View>

      <ImageBackground
        source={{ uri: "https://picsum.photos/seed/campus-banner/800/500" }}
        style={styles.heroBanner}
        imageStyle={{ borderRadius: Radius.lg }}
      >
        <LinearGradient
          colors={["rgba(6, 31, 61, 0.08)", "rgba(6, 31, 61, 0.82)"]}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>Discover Campus Events</Text>

          <Text style={styles.heroSubtitle}>
            Explore workshops, fests, sports & more!
          </Text>
        </LinearGradient>
      </ImageBackground>

      {visibleSections.map((section) => (
        <View key={section.title} style={{ marginTop: Spacing.lg }}>
          <Section
            title={section.title}
            data={section.data}
            loading={loading}
            navigation={navigation}
          />
        </View>
      ))}

      <Surface
        style={[
          styles.hostCard,
          {
            backgroundColor: colors.surface,
            borderRadius: Radius.lg,
          },
        ]}
      >
        <Text style={[styles.hostTitle, { color: colors.primary }]}>
          🎤 Want to Host an Event?
        </Text>

        <Text style={[styles.hostText, { color: colors.textSecondary }]}>
          Submit your event details and get featured on CampusConnect!
        </Text>

        <Button
          mode="contained"
          style={styles.hostBtn}
          buttonColor={colors.primary}
          onPress={() => navigation.navigate("HostEvent")}
        >
          Raise a Request
        </Button>
      </Surface>

      <View style={styles.statsRow}>
        {[
          { num: "50+", label: "Colleges" },
          { num: "200+", label: "Events" },
          { num: "5K+", label: "Participants" },
        ].map((item, index) => (
          <Surface
            key={index}
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                borderRadius: Radius.md,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {item.num}
            </Text>

            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {item.label}
            </Text>
          </Surface>
        ))}
      </View>

      <Surface
        style={[
          styles.aboutCard,
          {
            backgroundColor: colors.surface,
            borderRadius: Radius.lg,
          },
        ]}
      >
        <Text style={[styles.aboutTitle, { color: colors.primary }]}>
          About CampusConnect
        </Text>

        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          CampusConnect is your one-stop platform to explore, register, and
          participate in college events — from cultural fests to tech summits.
        </Text>
      </Surface>
    </ScrollView>
  );
}

const Section = React.memo(({ title, data, loading, navigation }) => {
  const colors = useAppTheme();
  const hasData = Array.isArray(data) && data.length > 0;

  if (!loading && !hasData) {
    return null;
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          {title}
        </Text>

        {hasData && (
          <TouchableOpacity onPress={() => navigation.navigate("Events")}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}> 
              View All →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.sectionSkeletonWrap}>
          <Surface
            style={[styles.sectionSkeletonCard, { backgroundColor: colors.border }]}
          />
        </View>
      ) : (
        <EventSection data={data} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: scale(110),
  },

  appbar: {
    paddingHorizontal: Spacing.lg,
    justifyContent: "space-between",
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },

  appName: {
    fontWeight: Fonts.weight.bold,
  },

  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },

  searchbar: {
    borderRadius: Radius.md,
    borderWidth: 1,
    ...Shadows.card,
  },

  heroBanner: {
    height: scale(200),
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: Spacing.md,
  },

  heroTitle: {
    color: "#fff",
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.bold,
  },

  heroSubtitle: {
    color: "#eee",
    marginTop: Spacing.xs,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
  },

  viewAllText: {
    marginTop: Spacing.xs,
    fontWeight: Fonts.weight.semiBold,
  },

  sectionSkeletonWrap: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },

  sectionSkeletonCard: {
    height: scale(260),
    borderRadius: Radius.lg,
  },

  hostCard: {
    marginHorizontal: Spacing.lg,
    marginTop: scale(30),
    padding: Spacing.xl,
    alignItems: "center",
    ...Shadows.card,
  },

  hostTitle: {
    fontWeight: Fonts.weight.bold,
    fontSize: Fonts.size.lg,
    marginBottom: Spacing.xs,
  },

  hostText: {
    textAlign: "center",
    marginBottom: Spacing.md,
    fontSize: Fonts.size.md,
  },

  hostBtn: {
    borderRadius: Radius.sm,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: scale(28),
  },

  statCard: {
    width: scale(95),
    paddingVertical: Spacing.md,
    alignItems: "center",
    ...Shadows.card,
  },

  statNumber: {
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.bold,
  },

  statLabel: {
    marginTop: Spacing.xs,
    fontWeight: Fonts.weight.medium,
  },

  aboutCard: {
    margin: Spacing.xl,
    padding: Spacing.xl,
    ...Shadows.card,
  },

  aboutTitle: {
    fontWeight: Fonts.weight.bold,
    fontSize: Fonts.size.lg,
    marginBottom: Spacing.xs,
  },

  aboutText: {
    lineHeight: 20,
  },
});
