import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Appbar, Searchbar, Text, Button, Surface } from "react-native-paper";

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

  const sortByDate = React.useCallback((arr, asc = true) => {
    return [...arr].sort((a, b) =>
      asc
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  const loadEvents = React.useCallback(async () => {
    try {
      const data = await eventAPI.getAll();
      const today = new Date();

      const valid = data.filter((e) => e?.date);

      setUpcoming(sortByDate(valid.filter((e) => new Date(e.date) >= today)));

      setPast(
        sortByDate(
          valid.filter((e) => new Date(e.date) < today),
          false
        )
      );

      setSportsCulture(
        sortByDate(
          data.filter((e) =>
            ["sports", "culture"].includes(e.category?.toLowerCase())
          )
        )
      );

      setEduTech(
        sortByDate(
          data.filter((e) =>
            ["tech", "education", "seminar", "workshop"].includes(
              e.category?.toLowerCase()
            )
          )
        )
      );
    } catch (err) {
      console.log("LoadEvents error:", err);
    }
  }, [sortByDate]);

  React.useEffect(() => {
    loadEvents();
  }, [loadEvents]);

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

      <View style={styles.searchCointainer}>
        <Searchbar
          placeholder="Search events, workshops, fests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPress={() => {
            navigation.navigate("Search");
          }}
          style={[styles.searchbar, { backgroundColor: colors.surface }]}
        />
      </View>

      <ImageBackground
        source={{ uri: "https://picsum.photos/seed/campus-banner/800/500" }}
        style={styles.heroBanner}
        imageStyle={{ borderRadius: Radius.lg }}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Discover Campus Events</Text>

          <Text style={styles.heroSubtitle}>
            Explore workshops, fests, sports & more!
          </Text>
        </View>
      </ImageBackground>

      <View style={{ marginTop: Spacing.lg }}>
        <Section
          title="🎉 Coming Up!"
          data={upcoming}
          navigation={navigation}
        />
      </View>

      <View style={{ marginTop: Spacing.lg }}>
        <Section title="🕒 The Past Ones" data={past} navigation={navigation} />
      </View>

      <View style={{ marginTop: Spacing.lg }}>
        <Section
          title="🏅 Sports & Culture"
          data={sportsCulture}
          navigation={navigation}
        />
      </View>

      <View style={{ marginTop: Spacing.lg }}>
        <Section
          title="💡 Education & Tech"
          data={eduTech}
          navigation={navigation}
        />
      </View>

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

const Section = React.memo(({ title, data, navigation }) => {
  const colors = useAppTheme();

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          {title}
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Events")}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      <EventSection data={data} />
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
    backgroundColor: "rgba(0,0,0,0.35)",
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
