import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  Appbar,
  Searchbar,
  Text,
  Button,
  Surface,
} from "react-native-paper";
import EventSection from "../components/EventSection";
import {
  pastEvents,
  comingEvents,
  techEvents,
  sportsEvents,
} from "../data/eventsData";

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const sections = [
    { id: "1", title: "🎓 Coming Up!", data: comingEvents },
    { id: "2", title: "🎭 The Past Ones", data: pastEvents },
    { id: "3", title: "💡 Tech Talks", data: techEvents },
    { id: "4", title: "🏅 Sports & Competitions", data: sportsEvents },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Appbar.Header style={styles.appbar}>
        <Text variant="headlineSmall" style={styles.appName}>
          CampusConnect
        </Text>
        <Appbar.Action icon="bell-outline" />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search events, workshops, fests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
        />
      </View>

      <ImageBackground
        source={{
          uri: "https://picsum.photos/seed/campus-banner/800/500",
        }}
        style={styles.heroBanner}
        imageStyle={{ borderRadius: 18 }}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Discover Campus Events</Text>
          <Text style={styles.heroSubtitle}>
            Explore workshops, fests, sports & more!
          </Text>
        </View>
      </ImageBackground>

      {sections.map((section) => (
        <View key={section.id} style={{ marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Events")}
            >
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          <EventSection title="" data={section.data} />
        </View>
      ))}

      <Surface style={styles.hostCard}>
        <Text style={styles.hostTitle}>🎤 Want to Host an Event?</Text>
        <Text style={styles.hostText}>
          Submit your event details and get featured on CampusConnect!
        </Text>

        <Button
          mode="contained"
          style={styles.hostBtn}
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
          <Surface key={index} style={styles.statCard}>
            <Text style={styles.statNumber}>{item.num}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </Surface>
        ))}
      </View>

      <Surface style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>About CampusConnect</Text>
        <Text style={styles.aboutText}>
          CampusConnect is your one-stop platform to explore, register,
          and participate in college events — from cultural fests to tech
          summits. Discover opportunities and grow your skills!
        </Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDF7F9",
    paddingBottom: 50,
  },

  appbar: {
    backgroundColor: "#fff",
    elevation: 3,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },

  appName: {
    color: "#E91E63",
    fontWeight: "800",
  },

  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  searchbar: {
    borderRadius: 14,
    elevation: 2,
  },

  heroBanner: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroOverlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#eee",
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C2185B",
  },
  viewAllText: {
    color: "#E91E63",
    marginTop: 4,
    fontWeight: "600",
  },

  hostCard: {
    marginHorizontal: 16,
    marginTop: 30,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#FFE4EC",
    alignItems: "center",
  },
  hostTitle: {
    color: "#C2185B",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
  },
  hostText: {
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
  hostBtn: {
    borderRadius: 8,
    backgroundColor: "#E91E63",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 28,
  },
  statCard: {
    width: 100,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#E91E63",
  },
  statLabel: {
    color: "#444",
    marginTop: 2,
    fontWeight: "500",
  },

  aboutCard: {
    margin: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#fff",
    elevation: 2,
  },
  aboutTitle: {
    color: "#E91E63",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
  },
  aboutText: {
    color: "#444",
    lineHeight: 20,
  },
});
