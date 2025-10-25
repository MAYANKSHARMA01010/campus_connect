import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';

const techData = [
  { id: 1, name: 'Artificial Intelligence', description: 'Study of intelligent agents and machine learning.', img: 'ai.png' },
  { id: 2, name: 'Blockchain', description: 'Decentralized digital ledger technology.', img: 'blockchain.png' },
  { id: 3, name: 'Cybersecurity', description: 'Protection of internet-connected systems.', img: 'cybersecurity.png' },
  { id: 4, name: 'Data Science', description: 'Extraction of knowledge from data.', img: 'datascience.png' },
  { id: 5, name: 'Internet of Things', description: 'Network of interconnected devices.', img: 'iot.png' },
]

const pastEvents = [
  { id: 1, title: 'Tech Symposium 2023', date: 'March 15, 2023', summary: 'A gathering of tech enthusiasts to discuss emerging technologies.', img: 'symposium2023.png' },
  { id: 2, title: 'AI Workshop', date: 'April 10, 2023', summary: 'Hands-on workshop on building AI models.', img: 'ai_workshop.png' },
  { id: 3, title: 'Blockchain Seminar', date: 'May 5, 2023', summary: 'Seminar on blockchain applications and trends.', img: 'blockchain_seminar.png' },
  { id: 4, title: 'Cybersecurity Conference', date: 'June 20, 2023', summary: 'Conference on the latest in cybersecurity.', img: 'cybersecurity_conference.png' },
  { id: 5, title: 'Data Science Bootcamp', date: 'July 15, 2023', summary: 'Intensive bootcamp on data science techniques.', img: 'data_science_bootcamp.png' },
]

const comingEvents = [
  { id: 1, title: 'IoT Expo 2024', date: 'August 10, 2024', summary: 'Expo showcasing the latest in IoT technology.', img: 'iot_expo2024.png' },
  { id: 2, title: 'AI & ML Summit', date: 'September 5, 2024', summary: 'Summit on advancements in AI and Machine Learning.', img: 'ai_ml_summit.png' },
  { id: 3, title: 'Blockchain Hackathon', date: 'October 12, 2024', summary: 'Hackathon focused on blockchain solutions.', img: 'blockchain_hackathon.png' },
  { id: 4, title: 'Cybersecurity Awareness Week', date: 'November 18, 2024', summary: 'Week dedicated to cybersecurity education.', img: 'cybersecurity_awareness.png' },
  { id: 5, title: 'Data Science Conference', date: 'December 3, 2024', summary: 'Conference on data science innovations.', img: 'data_science_conference.png' },
]

export default function HomeScreen() {
  return (
    <View>
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.bigC}>C</Text>

          <View style={styles.rightTextContainer}>
            <Text style={styles.ampus}>AMPUS</Text>
            <Text style={styles.onnect}>ONNECT</Text>
          </View>
        </View>
      </View>



      <View style={styles.pastEventsContainer}>
        <Text style={styles.sectionTitle}>Past Events</Text>
        <FlatList
          data={pastEvents.slice(0, 5)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventContainer}>
              <Image source={{ uri: item.img }} style={styles.eventImage} />
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
              <Text style={styles.eventSummary}>{item.summary}</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.viewMoreContainer}>
              <Text style={styles.viewMoreText}>View More</Text>
            </View>
          )}
          contentContainerStyle={styles.scrollContainer}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
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
  pastEventsContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  eventContainer: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 13,
    color: 'gray',
  },
  eventSummary: {
    fontSize: 14,
    marginTop: 4,
  },
  viewMoreContainer: {
    width: 220,
    height: 240,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
});
