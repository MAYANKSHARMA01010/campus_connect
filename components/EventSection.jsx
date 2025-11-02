import * as React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Card, Text, Button, Surface } from 'react-native-paper';

export default function EventSection({ title, data }) {
  const renderCard = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Cover source={{ uri: item.img }} style={styles.image} />
      <Card.Content>
        <Text variant="titleMedium" numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text variant="bodySmall" style={styles.date}>
          {item.date}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2} ellipsizeMode="tail" style={styles.summary}>
          {item.summary}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={styles.section} elevation={2}>
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
          <Surface style={styles.viewMoreContainer} elevation={1}>
            <Button mode="contained-tonal" onPress={() => {}}>
              View More
            </Button>
          </Surface>
        )}
        contentContainerStyle={styles.scrollContainer}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  card: {
    width: 220,
    height: 224,
    borderRadius: 12,
    marginRight: 12,
  },
  image: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  date: {
    color: 'gray',
    marginTop: 4,
  },
  summary: {
    marginTop: 4,
  },
  viewMoreContainer: {
    width: 220,
    height: 224,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
