import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text, Button, Surface } from 'react-native-paper';

export default function EventSection({ title, data }) {
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
      <Text variant="headlineSmall" style={styles.sectionTitle}>
        {title}
      </Text>
      <FlatList
        data={data.slice(0, 6)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        ListFooterComponent={() => (
          <View style={styles.viewMoreContainer}>
            <Button mode="outlined" onPress={() => {}}>
              View More
            </Button>
          </View>
        )}
        contentContainerStyle={styles.scrollContainer}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 18, marginBottom: 12 },
  sectionTitle: { marginLeft: 16, marginBottom: 10, fontWeight: '600' },
  scrollContainer: { paddingHorizontal: 16 },
  card: {
    width: 260,
    height: 300,
    borderRadius: 16,
    marginRight: 14,
    backgroundColor: '#fff',
  },
  image: {
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: { paddingVertical: 8 },
  cardTitle: { fontWeight: '600' },
  date: { color: '#777', marginTop: 2 },
  summary: { marginTop: 4 },
  viewMoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
  },
});
