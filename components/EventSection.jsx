import React, { memo, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Text, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Card = memo(({ item, navigation }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={styles.card}
    onPress={() => navigation.navigate("EventDetail", { id: item.id })}
  >
    <ImageBackground
      source={{ uri: item.images?.[0]?.url }}
      style={styles.bgImage}
      imageStyle={styles.bgImageStyle}
    >
      <View style={styles.gradientOverlay} />

      <View style={styles.overlayContent}>
        <Text variant="titleLarge" style={styles.overlayTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.overlayDate}>
          {item.date ? new Date(item.date).toDateString() : ""}
        </Text>
        <Text style={styles.overlaySummary} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
));

export default function EventSection({ data }) {
  const navigation = useNavigation();

  const renderItem = useCallback(
    ({ item }) => <Card item={item} navigation={navigation} />,
    [navigation]
  );

  const renderViewMore = useCallback(
    () => (
      <TouchableOpacity
        style={styles.viewMoreCard}
        onPress={() => navigation.navigate("Events")}
      >
        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>
    ),
    [navigation]
  );

  return (
    <Surface style={styles.section} elevation={0}>
      <FlatList
        horizontal
        data={data.slice(0, 6)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        removeClippedSubviews
        ListFooterComponent={renderViewMore}
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
  scrollContainer: {
    paddingHorizontal: 16,
  },
  card: {
    width: 300,
    height: 360,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "#fff",
    elevation: 6,
  },
  bgImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bgImageStyle: {
    borderRadius: 20,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  overlayContent: {
    padding: 18,
  },
  overlayTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,
    marginBottom: 4,
  },
  overlayDate: {
    color: "#FFD8E6",
    fontSize: 13,
    marginBottom: 8,
  },
  overlaySummary: {
    color: "#ffffffcc",
    fontSize: 14,
  },
  viewMoreCard: {
    width: 300,
    height: 360,
    borderRadius: 20,
    marginRight: 18,
    borderWidth: 1.6,
    borderColor: "#E91E63",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  viewMoreText: {
    color: "#E91E63",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
