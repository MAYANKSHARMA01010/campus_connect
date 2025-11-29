import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button, Surface, ActivityIndicator, Appbar } from "react-native-paper";
import { useAuth } from "../context/UserContext";

export default function EventPreviewScreen({ route, navigation }) {
  const { form, onPublish } = route.params || {};
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const publishEvent = async () => {
    if (!onPublish || typeof onPublish !== "function") {
      Alert.alert("Error", "Publish function not available.");
      return;
    }

    try {
      setLoading(true);
      const result = await onPublish();
      setLoading(false);

      if (result && result.success) {
        try {
          navigation.pop(2);
        } catch (e) {
          navigation.navigate("MainTabs");
        }
      } else {
        Alert.alert("Error", "Publish failed");
      }
    } catch (err) {
      setLoading(false);
      console.log("publish error", err);
      Alert.alert("Publish failed", err.message || "Unknown error");
    }
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: "#E91E63" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Preview Event" color="white" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.card}>
          <Text style={styles.title}>{form.title}</Text>
          <Text style={styles.subtitle}>{form.category}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {form.images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.image} />
            ))}
          </ScrollView>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{form.description}</Text>

          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{form.date}</Text>

          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{form.time}</Text>

          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{form.location || "Not provided"}</Text>

          <Text style={styles.label}>Contact</Text>
          <Text style={styles.value}>{form.contact || "Not provided"}</Text>

          <Button
            mode="contained"
            style={styles.publishBtn}
            onPress={publishEvent}
            buttonColor="#E91E63"
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : "Publish Event"}
          </Button>
        </Surface>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { padding: 20, borderRadius: 20, elevation: 6, backgroundColor: "white" },
  title: { fontSize: 22, fontWeight: "800", color: "#E91E63" },
  subtitle: { fontSize: 16, color: "#777", marginBottom: 20 },
  image: { width: 140, height: 110, borderRadius: 12, marginRight: 10 },
  label: { marginTop: 14, fontSize: 14, fontWeight: "700", color: "#444" },
  value: { fontSize: 14, color: "#333", marginTop: 3 },
  publishBtn: { marginTop: 25, borderRadius: 12 },
});
