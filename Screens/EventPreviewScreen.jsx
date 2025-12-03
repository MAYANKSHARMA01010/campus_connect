import React, { useState } from "react";
import { View, Image, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Button,
  Surface,
  ActivityIndicator,
  Appbar,
} from "react-native-paper";

import { useAuth } from "../context/UserContext";
import { CLOUD_NAME, UPLOAD_PRESET } from "@env";
import { eventAPI } from "../api/api";
import { Platform } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

export default function EventPreviewScreen({ route, navigation }) {
  const { form, onPublish } = route.params || {};
  const { user } = useAuth();
  const colors = useAppTheme();

  const [loading, setLoading] = useState(false);

  const [uploadingCount, setUploadingCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);

  async function uploadLocalImage(uri) {
    if (!CLOUD_NAME || !UPLOAD_PRESET)
      throw new Error("Cloudinary config missing");

    const name = uri.split("/").pop();
    const ext = name.split(".").pop() || "jpg";

    const data = new FormData();
    data.append("file", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });

    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || "Image upload failed");

    return json.secure_url;
  }

  const publishEvent = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const localImages = form.images.filter((u) => !/^https?:\/\//.test(u));

      setUploadingCount(0);
      setTotalToUpload(localImages.length);

      const uploaded = [];

      for (let img of localImages) {
        const url = await uploadLocalImage(img);
        uploaded.push(url);
        setUploadingCount((c) => c + 1);
      }

      const payload = {
        ...form,
        date: new Date(form.date).toISOString(),
        imageUrls: uploaded,
        createdBy: user?.id ?? null,
      };

      await eventAPI.submitRequest(payload);

      Alert.alert("Success", "Event submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            try {
              navigation.pop(2);
            } catch (e) {
              navigation.navigate("MainTabs");
            }
          },
        },
      ]);
    } catch (err) {
      console.log("publish error", err);
      Alert.alert("Publish failed", err.message || "Unknown error");
    } finally {
      setLoading(false);
      setUploadingCount(0);
      setTotalToUpload(0);
    }
  };

  if (!form) return null;

  return (
    <>
      <Appbar.Header elevated style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.textPrimary}
        />
        <Appbar.Content
          title="Preview Event"
          titleStyle={{ fontWeight: Fonts.weight.semiBold }}
          color={colors.textPrimary}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <Surface
          style={[
            styles.card,
            {
              borderRadius: Radius.xl,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.primary }]}>
            {form.title}
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {form.category}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: Spacing.md }}
          >
            {form.images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.image} />
            ))}
          </ScrollView>

          <Detail label="Description" value={form.description} />
          <Detail label="Date" value={form.date} />
          <Detail label="Time" value={form.time} />
          <Detail label="Location" value={form.location || "Not provided"} />
          <Detail label="Contact" value={form.contact || "Not provided"} />

          <Button
            mode="contained"
            style={styles.publishBtn}
            onPress={publishEvent}
            disabled={loading}
            buttonColor={colors.primary}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              "Publish Event"
            )}
          </Button>
        </Surface>
      </ScrollView>
    </>
  );
}

function Detail({ label, value }) {
  const colors = useAppTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>

      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },

  card: {
    padding: Spacing.xl,
    ...Shadows.card,
  },

  title: {
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.bold,
  },

  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    fontSize: Fonts.size.md,
  },

  image: {
    width: scale(140),
    height: scale(110),
    borderRadius: Radius.md,
    marginRight: Spacing.sm,
  },

  row: {
    marginTop: Spacing.md,
  },

  label: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.semiBold,
  },

  value: {
    marginTop: Spacing.xs,
    fontSize: Fonts.size.md,
  },

  publishBtn: {
    marginTop: Spacing.xl,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
  },
});
