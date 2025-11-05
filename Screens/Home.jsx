import * as React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView 
} from 'react-native';
import {
  Appbar,
  Searchbar,
  Surface,
  Text,
  Button,
  Card,
} from 'react-native-paper';
import EventSection from '../components/EventSection';
import {
  pastEvents,
  comingEvents,
  techEvents,
  sportsEvents,
} from '../data/eventsData';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const sections = [
    { id: '1', title: "🎓 Coming Up!", data: comingEvents },
    { id: '2', title: "🎭 The Past Ones", data: pastEvents },
    { id: '3', title: "💡 Tech Talks", data: techEvents },
    { id: '4', title: "🏅 Sports & Competitions", data: sportsEvents },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Appbar.Header style={styles.appbar}>
        <Text variant="titleLarge" style={styles.appName}>
          CampusConnect
        </Text>
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search events, workshops, fests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
        />
      </View>

      <Card style={styles.bannerCard} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.bannerTitle}>
            Discover, Engage, & Participate in Campus Events!
          </Text>
          <Text variant="bodyMedium" style={styles.bannerText}>
            Find upcoming fests, workshops, and competitions across your campus —
            all in one place.
          </Text>
        </Card.Content>
      </Card>

      {
        sections.map((section) => (
          <EventSection key={section.id} title={section.title} data={section.data} />
        ))
      }

      <View style={styles.viewAllContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Events')}
          style={styles.viewAllBtn}
        >
          View All Events
        </Button>
      </View>

      <Surface style={styles.hostCard}>
        <Text variant="headlineSmall" style={styles.hostTitle}>
          🎤 Want to Host an Event?
        </Text>
        <Text variant="bodyMedium" style={styles.hostText}>
          Submit your event details and get featured on CampusConnect!
        </Text>
        <Button
          mode="contained"
          style={styles.hostBtn}
          onPress={() => navigation.navigate('HostEvent')}
        >
          Raise a Request
        </Button>
      </Surface>

      <View style={styles.statsRow}>
        <Surface style={styles.statCard}>
          <Text variant="headlineMedium" style={styles.statNumber}>50+</Text>
          <Text variant="bodySmall">Colleges</Text>
        </Surface>
        <Surface style={styles.statCard}>
          <Text variant="headlineMedium" style={styles.statNumber}>200+</Text>
          <Text variant="bodySmall">Events</Text>
        </Surface>
        <Surface style={styles.statCard}>
          <Text variant="headlineMedium" style={styles.statNumber}>5K+</Text>
          <Text variant="bodySmall">Participants</Text>
        </Surface>
      </View>

      <Surface style={styles.aboutCard} elevation={2}>
        <Text variant="headlineSmall" style={styles.aboutTitle}>
          About CampusConnect
        </Text>
        <Text variant="bodyMedium" style={styles.aboutText}>
          CampusConnect is your one-stop platform to explore, register, and
          participate in college events — from cultural fests to tech summits.
          Discover opportunities, meet new people, and grow your skills — all in one place!
        </Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    paddingBottom: 40,
  },

  appbar: {
    backgroundColor: '#fff',
    elevation: 3,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  appName: {
    color: '#E91E63',
    fontWeight: '700',
  },

  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchbar: {
    borderRadius: 12,
  },

  bannerCard: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: '#E91E63',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  bannerText: {
    color: '#fff',
    opacity: 0.9,
  },

  categoryScroll: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  categoryChip: {
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#E91E63',
  },

  viewAllContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  viewAllBtn: {
    width: '70%',
    borderRadius: 12,
    backgroundColor: '#E91E63',
  },

  hostCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#FFE5EC',
    alignItems: 'center',
  },
  hostTitle: {
    color: '#C2185B',
    fontWeight: '700',
    marginBottom: 6,
  },
  hostText: {
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  hostBtn: {
    borderRadius: 10,
    backgroundColor: '#E91E63',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginHorizontal: 16,
  },
  statCard: {
    width: 100,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 2,
  },
  statNumber: {
    color: '#E91E63',
    fontWeight: '700',
  },

  aboutCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginTop: 30,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  aboutTitle: {
    color: '#E91E63',
    fontWeight: '700',
    marginBottom: 6,
  },
  aboutText: {
    color: '#444',
    height: 100,
  },
});
