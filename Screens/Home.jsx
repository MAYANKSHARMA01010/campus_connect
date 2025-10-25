import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';

const techEvents = [
  { id: 1, title: 'Tech Symposium 2024', date: 'August 15, 2024', summary: 'A gathering of tech enthusiasts to discuss emerging technologies.', img: 'https://source.unsplash.com/400x300/?technology,conference' },
  { id: 2, title: 'AI Workshop', date: 'September 10, 2024', summary: 'Hands-on workshop on building AI models.', img: 'https://source.unsplash.com/400x300/?ai,workshop' },
  { id: 3, title: 'Blockchain Seminar', date: 'October 5, 2024', summary: 'Seminar on blockchain applications and trends.', img: 'https://source.unsplash.com/400x300/?blockchain,seminar' },
  { id: 4, title: 'Cybersecurity Conference', date: 'November 20, 2024', summary: 'Conference on the latest in cybersecurity.', img: 'https://source.unsplash.com/400x300/?cybersecurity,conference' },
  { id: 5, title: 'Data Science Bootcamp', date: 'December 15, 2024', summary: 'Intensive bootcamp on data science techniques.', img: 'https://source.unsplash.com/400x300/?data,bootcamp' },
  { id: 6, title: 'Mobile Dev Meetup', date: 'January 10, 2025', summary: 'Meetup for mobile app developers to share ideas.', img: 'https://source.unsplash.com/400x300/?mobile,development' },
  { id: 7, title: 'Cloud Computing Summit', date: 'February 5, 2025', summary: 'Summit discussing cloud infrastructure and trends.', img: 'https://source.unsplash.com/400x300/?cloud,computing' },
  { id: 8, title: 'Startup Pitch Night', date: 'March 12, 2025', summary: 'Event for startups to pitch their ideas to investors.', img: 'https://source.unsplash.com/400x300/?startup,pitch' },
];

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
];

const comingEvents = [
  { id: 1, title: 'Spring Tech Fest', date: 'April 10, 2024', summary: 'A festival celebrating the latest in technology and innovation.', img: 'https://source.unsplash.com/400x300/?tech,festival' },
  { id: 2, title: 'Robotics Workshop', date: 'May 15, 2024', summary: 'Interactive workshop on building and programming robots.', img: 'https://source.unsplash.com/400x300/?robotics,workshop' },
  { id: 3, title: 'Digital Marketing Seminar', date: 'June 20, 2024', summary: 'Seminar on the latest trends in digital marketing.', img: 'https://source.unsplash.com/400x300/?digital,marketing' },
  { id: 4, title: 'E-commerce Conference', date: 'July 25, 2024', summary: 'Conference discussing e-commerce strategies and technologies.', img: 'https://source.unsplash.com/400x300/?ecommerce,conference' },
  { id: 5, title: 'App Development Bootcamp', date: 'August 30, 2024', summary: 'Bootcamp focused on mobile app development skills.', img: 'https://source.unsplash.com/400x300/?app,development' },
];

const sportsEvents = [
  { id: 1, title: 'Intercollegiate Football Championship', date: 'September 15, 2024', summary: 'Annual football championship between colleges.', img: 'https://source.unsplash.com/400x300/?football,championship' },
  { id: 2, title: 'City Marathon 2024', date: 'October 20, 2024', summary: 'Join runners from around the city in this exciting marathon event.', img: 'https://source.unsplash.com/400x300/?marathon,running' },
  { id: 3, title: 'Basketball Tournament', date: 'November 10, 2024', summary: 'Competitive basketball tournament featuring top teams.', img: 'https://source.unsplash.com/400x300/?basketball,tournament' },
  { id: 4, title: 'Swimming Gala', date: 'December 5, 2024', summary: 'Annual swimming competition with various categories.', img: 'https://source.unsplash.com/400x300/?swimming,gala' },
  { id: 5, title: 'Tennis Open 2024', date: 'January 15, 2025', summary: 'Open tennis tournament for amateur and professional players.', img: 'https://source.unsplash.com/400x300/?tennis,open' },
];

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

      {/* PAST EVENTS */}
      <View style={styles.EventSection}>
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
      
      {/* COMING EVENTS */}
      <View style={styles.EventSection}>
        <Text style={styles.sectionTitle}>Coming Events</Text>
        <FlatList
          data={comingEvents.slice(0, 5)}
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
      
      {/* TECH EVENTS */}
      <View style={styles.EventSection}>
        <Text style={styles.sectionTitle}>Tech Events</Text>
        <FlatList
          data={techEvents.slice(0, 5)}
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
      
      {/* SPORTS EVENTS */}
      <View style={styles.EventSection}>
        <Text style={styles.sectionTitle}>Sports Events</Text>
        <FlatList
          data={sportsEvents.slice(0, 5)}
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
  EventSection: {
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
