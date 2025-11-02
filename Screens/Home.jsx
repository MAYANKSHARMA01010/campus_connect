import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import EventSection from '../components/EventSection';

import { 
  pastEvents, 
  comingEvents, 
  techEvents, 
  sportsEvents 
} from '../data/eventsData';

export default function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Surface style={styles.headerSurface}>
        <View style={styles.row}>
          <Text variant="displayMedium" style={styles.bigC}>C</Text>
          <View style={styles.rightTextContainer}>
            <Text variant="titleLarge" style={styles.ampus}>AMPUS</Text>
            <Text variant="titleLarge" style={styles.onnect}>ONNECT</Text>
          </View>
        </View>
      </Surface>

      <EventSection title="Past Events" data={pastEvents} />
      <EventSection title="Coming Events" data={comingEvents} />
      <EventSection title="Tech Events" data={techEvents} />
      <EventSection title="Sports Events" data={sportsEvents} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  headerSurface: {
    marginTop: 18,
    marginLeft: 38,
    marginRight: 16,
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bigC: {
    fontWeight: 'bold',
  },
  rightTextContainer: {
    flexDirection: 'column',
    marginTop: 16,
    marginLeft: 3,
  },
  ampus: {
    fontWeight: 'bold',
  },
  onnect: {
    marginTop: -5,
    fontWeight: 'bold',
  },
});
