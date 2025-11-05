import * as React from 'react';
import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import { Card, Text, Button, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const CARD_HEIGHT = CARD_WIDTH * 0.62;

export default function EventSection({ title, data }) {
  const navigation = useNavigation();

  const renderCard = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Cover source={{ uri: item.img }} style={styles.image} />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text variant="bodySmall" style={styles.date}>
          {item.date}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.summary}>
          {item.summary}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={styles.section} elevation={0}>
      <View style={styles.titleContainer}>
        <View style={styles.line} />
        <Text variant="titleMedium" style={styles.sectionTitle}>
          IN THE SPOTLIGHT · {title.toUpperCase()}
        </Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={data.slice(0, 6)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        ListFooterComponent={() => (
          <View style={styles.viewMoreContainer}>
            <Button
              mode="outlined"
              textColor="#E91E63"
              style={styles.viewMoreBtn}
              onPress={() => navigation.navigate('Events')}>
              View More
            </Button>
          </View>
        )}
        contentContainerStyle={styles.scrollContainer}
      />
    </Surface>
  );
}

// your existing styles below ↓
const styles = StyleSheet.create({
  section: {
    marginTop: 22,
    marginBottom: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#E91E63',
    fontSize: 15,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT + 120,
    borderRadius: 18,
    marginRight: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: CARD_HEIGHT,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardContent: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  date: {
    color: '#777',
    marginTop: 4,
    fontSize: 12,
  },
  summary: {
    marginTop: 6,
    color: '#444',
    fontSize: 13,
  },
  viewMoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
  },
  viewMoreBtn: {
    borderColor: '#E91E63',
    borderRadius: 10,
  },
});
