import React from 'react';
import EventSection from '../components/EventSection';

import { 
  View, 
  Text,
  ScrollView, 
  StyleSheet 
} from 'react-native';

import { 
  pastEvents, 
  comingEvents, 
  techEvents, 
  sportsEvents 
} from '../data/eventsData';


export default function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.bigC}>C</Text>
          <View style={styles.rightTextContainer}>
            <Text style={styles.ampus}>AMPUS</Text>
            <Text style={styles.onnect}>ONNECT</Text>
          </View>
        </View>
      </View>

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
    backgroundColor: '#f2f2f2',
  },
  textContainer: {
    marginTop: 18,
    marginLeft: 38,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bigC: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  rightTextContainer: {
    flexDirection: 'column',
    marginTop: 16,
    marginLeft: 3,
  },
  ampus: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  onnect: {
    fontSize: 20,
    marginTop: -5,
    fontWeight: 'bold',
  },
});
