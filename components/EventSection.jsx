import * as React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

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

  const renderViewMoreCard = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Events')}>
      <View style={styles.viewMoreCard}>
        <Text style={styles.viewMoreText}>View More</Text>
      </View>
    </TouchableOpacity>
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
        ListFooterComponent={renderViewMoreCard}
        contentContainerStyle={styles.scrollContainer}
      />
    </Surface>
  );
}

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

  // Normal fixed card sizing (no Dimensions)
  card: {
    width: 280,
    height: 320,
    borderRadius: 18,
    marginRight: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
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

  // Matching "View More" card
  viewMoreCard: {
    width: 280,
    height: 320,
    borderRadius: 18,
    marginRight: 16,
    borderWidth: 1.5,
    borderColor: '#E91E63',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#E91E63',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
