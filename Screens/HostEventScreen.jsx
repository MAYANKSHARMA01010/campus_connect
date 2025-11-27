// HostEventScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Surface,
  Snackbar,
  IconButton,
  Appbar,
  ActivityIndicator,
  Menu,
} from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuth } from "../context/UserContext";
import { CLOUD_NAME, UPLOAD_PRESET } from "@env";
import API from "../api/api";

const CATEGORY_OPTIONS = [
  "Music",
  "Tech",
  "Sports",
  "Workshop",
  "Seminar",
  "Cultural",
  "Gaming",
  "Other",
];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  location: "",
  hostName: "",
  contact: "",
  images: [],
};

export default function HostEventScreen({ navigation }) {
  const { user } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const [snack, setSnack] = useState({ visible: false, message: "", type: "info" });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [uploadingCount, setUploadingCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);

  const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // Validation
  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = "Required";
    if (!form.description.trim()) err.description = "Required";
    if (!form.category.trim()) err.category = "Required";
    if (!form.date.trim()) err.date = "Required";
    if (!form.time.trim()) err.time = "Required";
    if (form.images.length < 4) err.images = "Add at least 4 images";

    if (form.contact && !/^[0-9]{10}$/.test(form.contact))
      err.contact = "Enter valid 10-digit mobile number";

    return err;
  };
  const errors = validate();

  // Image picker robust
  const pickImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setSnack({ visible: true, message: "Gallery permission required", type: "error" });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.8,
      });

      if (!result) return;
      if (result.canceled) return;

      let uris = [];
      if (Array.isArray(result.assets)) uris = result.assets.map((a) => a.uri);
      else if (Array.isArray(result.selected)) uris = result.selected.map((a) => a.uri || a);
      else if (result.uri) uris = [result.uri];

      if (uris.length === 0) return;

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uris].slice(0, 10),
      }));
    } catch (err) {
      console.log("pickImages error", err);
      setSnack({ visible: true, message: "Failed to pick images", type: "error" });
    }
  };

  const removeImage = (uri) => setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== uri) }));

  // Cloudinary upload for single local image
  async function uploadLocalImageToCloudinary(uri) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary config missing (CLOUD_NAME / UPLOAD_PRESET)");
    }

    const fileName = uri.split("/").pop();
    const ext = fileName.split(".").pop() || "jpg";
    const fileType = `image/${ext === "jpg" ? "jpeg" : ext}`;

    const data = new FormData();
    data.append("file", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name: fileName,
      type: fileType,
    });
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (!res.ok) {
      console.log("Cloudinary error:", json);
      throw new Error(json?.error?.message || "Cloudinary upload failed");
    }

    return json.secure_url;
  }

  // sendEventToServer sends imageUrls to your backend
  async function sendEventToServer(imageUrls) {
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      date: new Date(form.date).toISOString(),
      time: form.time,
      location: form.location,
      hostName: form.hostName,
      contact: form.contact,
      imageUrls,
      createdBy: user?.id ?? null,
    };

    const res = await API.post("/events/request", payload);
    return res.data;
  }

  // submit: upload local images -> send to server
  // IMPORTANT: this returns { success: true } or throws
  const submit = async () => {
    setTouched({
      title: true,
      description: true,
      category: true,
      date: true,
      time: true,
      images: true,
    });

    if (!user) throw new Error("Login required");

    if (Object.keys(errors).length > 0) {
      throw new Error("Validation failed");
    }

    setLoading(true);
    try {
      const localImgs = form.images.filter((u) => !/^https?:\/\//.test(u));
      const remoteImgs = form.images.filter((u) => /^https?:\/\//.test(u));

      let uploadedUrls = [];
      if (localImgs.length > 0) {
        setTotalToUpload(localImgs.length);
        setUploadingCount(0);

        for (let i = 0; i < localImgs.length; i++) {
          try {
            const url = await uploadLocalImageToCloudinary(localImgs[i]);
            uploadedUrls.push(url);
          } catch (err) {
            console.log("upload error", err);
            throw new Error("Image upload failed");
          } finally {
            setUploadingCount((c) => c + 1);
          }
        }
      }

      const finalImages = [...remoteImgs, ...uploadedUrls];

      await sendEventToServer(finalImages);

      // success — return true for caller to handle navigation
      return { success: true };
    } finally {
      setLoading(false);
      setUploadingCount(0);
      setTotalToUpload(0);
    }
  };

  // Navigate to preview and pass the publish callback
  const goToPreview = () => {
    setTouched({
      title: true,
      description: true,
      category: true,
      date: true,
      time: true,
      images: true,
    });

    if (Object.keys(errors).length > 0) {
      setSnack({ visible: true, message: "Fix errors first", type: "error" });
      return;
    }

    // Passing a function through navigation params is okay in RN — preview will call it
    navigation.navigate("EventPreview", { form, onPublish: submit });
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Appbar.Header style={{ backgroundColor: "#E91E63" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Host Event" color="white" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.card}>
          <Text style={styles.title}>Create your Event</Text>
          <Text style={styles.subtitle}>Fill details to host a campus event 🎉</Text>

          {/* Title */}
          <TextInput
            label="Event Title *"
            mode="outlined"
            style={styles.input}
            value={form.title}
            onChangeText={(v) => handleChange("title", v)}
            onBlur={() => setTouched((s) => ({ ...s, title: true }))}
          />
          <HelperText type="error" visible={touched.title && !!errors.title}>
            {errors.title}
          </HelperText>

          {/* Description */}
          <TextInput
            label="Description *"
            mode="outlined"
            multiline
            style={[styles.input, { height: 100 }]}
            value={form.description}
            onChangeText={(v) => handleChange("description", v)}
            onBlur={() => setTouched((s) => ({ ...s, description: true }))}
          />
          <HelperText type="error" visible={touched.description && !!errors.description}>
            {errors.description}
          </HelperText>

          {/* Category */}
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => {
              setCategoryMenuVisible(false);
              setTouched((s) => ({ ...s, category: true }));
            }}
            anchor={
              <TouchableOpacity onPress={() => setCategoryMenuVisible(true)} style={styles.dropdown}>
                <Text style={{ color: form.category ? "#000" : "#777" }}>
                  {form.category || "Select Category *"}
                </Text>
                <IconButton icon="chevron-down" size={22} />
              </TouchableOpacity>
            }
          >
            {CATEGORY_OPTIONS.map((c) => (
              <Menu.Item
                key={c}
                title={c}
                onPress={() => {
                  handleChange("category", c);
                  setCategoryMenuVisible(false);
                  setTouched((s) => ({ ...s, category: true }));
                }}
              />
            ))}
          </Menu>
          <HelperText type="error" visible={touched.category && !!errors.category}>
            {errors.category}
          </HelperText>

          {/* Date */}
          <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.dropdown}>
            <Text style={{ color: form.date ? "#000" : "#777" }}>{form.date || "Select Date *"}</Text>
            <IconButton icon="calendar" size={22} />
          </TouchableOpacity>
          {datePickerVisible && (
            <DateTimePicker
              value={form.date ? new Date(form.date) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selected) => {
                if (Platform.OS === "android") setDatePickerVisible(false);
                if (selected) {
                  const isoDate = selected.toISOString().split("T")[0];
                  handleChange("date", isoDate);
                  setTouched((s) => ({ ...s, date: true }));
                }
              }}
            />
          )}
          <HelperText type="error" visible={touched.date && !!errors.date}>
            {errors.date}
          </HelperText>

          {/* Time */}
          <TouchableOpacity onPress={() => setTimePickerVisible(true)} style={styles.dropdown}>
            <Text style={{ color: form.time ? "#000" : "#777" }}>{form.time || "Select Time *"}</Text>
            <IconButton icon="clock" size={22} />
          </TouchableOpacity>
          {timePickerVisible && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selected) => {
                if (Platform.OS === "android") setTimePickerVisible(false);
                if (selected) {
                  const time = selected.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  handleChange("time", time);
                  setTouched((s) => ({ ...s, time: true }));
                }
              }}
            />
          )}
          <HelperText type="error" visible={touched.time && !!errors.time}>
            {errors.time}
          </HelperText>

          {/* Optional */}
          <TextInput label="Location" mode="outlined" style={styles.input} value={form.location} onChangeText={(v) => handleChange("location", v)} />
          <TextInput label="Host Name" mode="outlined" style={styles.input} value={form.hostName} onChangeText={(v) => handleChange("hostName", v)} />
          <TextInput
            label="Contact Number"
            keyboardType="number-pad"
            mode="outlined"
            style={styles.input}
            value={form.contact}
            onChangeText={(v) => handleChange("contact", v)}
            onBlur={() => setTouched((s) => ({ ...s, contact: true }))}
          />
          <HelperText type="error" visible={touched.contact && !!errors.contact}>
            {errors.contact}
          </HelperText>

          {/* Images */}
          <Text style={styles.sectionTitle}>Upload Images *</Text>
          <Text style={styles.sectionSubtitle}>Minimum 4 required</Text>

          <View style={styles.imageGrid}>
            {form.images.map((uri, i) => (
              <View key={uri + i} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <IconButton icon="close" size={18} style={styles.removeBtn} onPress={() => removeImage(uri)} />
              </View>
            ))}

            {form.images.length < 10 && (
              <TouchableOpacity onPress={pickImages} style={styles.addImageBox}>
                <IconButton icon="plus" size={30} iconColor="#E91E63" />
                <Text style={{ color: "#E91E63" }}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          <HelperText type="error" visible={touched.images && !!errors.images}>
            {errors.images}
          </HelperText>

          {uploadingCount > 0 && (
            <View style={{ flexDirection: "row", marginTop: 8, alignItems: "center" }}>
              <ActivityIndicator size={20} />
              <Text style={{ marginLeft: 10 }}>Uploading {uploadingCount} / {totalToUpload}</Text>
            </View>
          )}

          <Button mode="contained" loading={loading} onPress={goToPreview} style={styles.submitBtn} buttonColor="#E91E63" disabled={loading}>
            Preview Event
          </Button>
        </Surface>

        <Snackbar visible={snack.visible} onDismiss={() => setSnack((s) => ({ ...s, visible: false }))} duration={3000}>
          {snack.message}
        </Snackbar>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  card: { padding: 20, borderRadius: 20, elevation: 6, backgroundColor: "white" },
  title: { fontSize: 22, fontWeight: "800", color: "#E91E63", marginBottom: 4 },
  subtitle: { color: "#777", marginBottom: 20 },
  input: { marginBottom: 12, backgroundColor: "#FAFAFA" },
  dropdown: { height: 55, borderWidth: 1, borderColor: "#aaa", paddingHorizontal: 15, borderRadius: 10, marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 12 },
  sectionSubtitle: { color: "#777", marginBottom: 8 },
  imageGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10, gap: 8 },
  imageWrapper: { position: "relative", marginRight: 8, marginBottom: 8 },
  image: { width: 95, height: 95, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  removeBtn: { position: "absolute", top: -6, right: -6, backgroundColor: "white" },
  addImageBox: { width: 95, height: 95, borderRadius: 12, borderWidth: 2, borderColor: "#E91E63", justifyContent: "center", alignItems: "center", backgroundColor: "#FFE4EC", marginBottom: 8 },
  submitBtn: { marginTop: 20, borderRadius: 12 },
});
