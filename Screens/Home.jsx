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
  { id: 1, title: 'Tech Symposium 2023', date: 'March 15, 2023', summary: 'A gathering of tech enthusiasts to discuss emerging technologies.', img: 'https://source.unsplash.com/400x300/?technology,conference' },
  { id: 2, title: 'AI Workshop', date: 'April 10, 2023', summary: 'Hands-on workshop on building AI models.', img: 'https://source.unsplash.com/400x300/?ai,workshop' },
  { id: 3, title: 'Blockchain Seminar', date: 'May 5, 2023', summary: 'Seminar on blockchain applications and trends.', img: 'https://source.unsplash.com/400x300/?blockchain,seminar' },
  { id: 4, title: 'Cybersecurity Conference', date: 'June 20, 2023', summary: 'Conference on the latest in cybersecurity.', img: 'https://source.unsplash.com/400x300/?cybersecurity,conference' },
  { id: 5, title: 'Data Science Bootcamp', date: 'July 15, 2023', summary: 'Intensive bootcamp on data science techniques.', img: 'https://source.unsplash.com/400x300/?data,bootcamp' },
  { id: 6, title: 'Mobile Dev Meetup', date: 'August 10, 2023', summary: 'Meetup for mobile app developers to share ideas.', img: 'https://source.unsplash.com/400x300/?mobile,development' },
  { id: 7, title: 'Cloud Computing Summit', date: 'September 5, 2023', summary: 'Summit discussing cloud infrastructure and trends.', img: 'https://source.unsplash.com/400x300/?cloud,computing' },
  { id: 8, title: 'Startup Pitch Night', date: 'October 12, 2023', summary: 'Event for startups to pitch their ideas to investors.', img: 'https://source.unsplash.com/400x300/?startup,pitch' },
  { id: 9, title: 'VR/AR Expo', date: 'November 20, 2023', summary: 'Exposition showcasing VR and AR innovations.', img: 'https://source.unsplash.com/400x300/?vr,ar' },
  { id: 10, title: 'IoT Hackathon', date: 'December 15, 2023', summary: 'Hackathon focused on IoT device solutions.', img: 'https://source.unsplash.com/400x300/?iot,hackathon' },
  { id: 11, title: 'Machine Learning Conference', date: 'January 25, 2024', summary: 'Conference exploring advances in machine learning.', img: 'https://source.unsplash.com/400x300/?machine,learning' },
];

const comingEvents = [
  { id: 1, title: 'IoT Expo 2024', date: 'August 10, 2024', summary: 'Expo showcasing the latest in IoT technology.', img: 'iot_expo2024.png' },
  { id: 2, title: 'AI & ML Summit', date: 'September 5, 2024', summary: 'Summit on advancements in AI and Machine Learning.', img: 'ai_ml_summit.png' },
  { id: 3, title: 'Blockchain Hackathon', date: 'October 12, 2024', summary: 'Hackathon focused on blockchain solutions.', img: 'blockchain_hackathon.png' },
  { id: 4, title: 'Cybersecurity Awareness Week', date: 'November 18, 2024', summary: 'Week dedicated to cybersecurity education.', img: 'cybersecurity_awareness.png' },
  { id: 5, title: 'Data Science Conference', date: 'December 3, 2024', summary: 'Conference on data science innovations.', img: 'data_science_conference.png' },
]

export default function HomeScreen() {
  return (
    <View style={styles.container}>
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
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventContainer}>
              <Image source={{ uri: item.img }} style={styles.eventImage} />
              <Text 
                style={styles.eventTitle} 
                numberOfLines={1} 
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <Text style={styles.eventDate}>{item.date}</Text>
              <Text 
                style={styles.eventSummary} 
                numberOfLines={2} 
                ellipsizeMode="tail"
              >
                {item.summary}
              </Text>
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
    height: 224,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
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
    height: 28,
  },
  eventDate: {
    fontSize: 13,
    color: 'gray',
  },
  eventSummary: {
    fontSize: 14,
    marginTop: 4,
    height: 36,
  },
  viewMoreContainer: {
    width: 220,
    height: 224,
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
