// ⭐⭐⭐⭐⭐ COMPLETE FIXED + UPDATED HOST EVENT PAGE
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
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
  Divider,
} from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";

import API from "../api/api";
import { useAuth } from "../context/UserContext";

const CLOUD_NAME = process.env.CLOUD_NAME;
const UPLOAD_PRESET = process.env.UPLOAD_PRESET;

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

const initialForm = {
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

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ visible: false, message: "", type: "info" });
  const [touched, setTouched] = useState({});

  // Category dropdown state
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  // Date Picker
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Time Picker
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Image Upload state
  const [uploadingCount, setUploadingCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);

  const handleChange = (k, v) => setForm({ ...form, [k]: v });

  // ⭐⭐ FIXED Image Picker NEW SYNTAX ⭐⭐
  const pickImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setSnack({ visible: true, message: "Gallery permission required", type: "error" });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // NEW SYNTAX
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.8,
      });

      if (result.canceled) return;

      const uris = result.assets.map((img) => img.uri);

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uris].slice(0, 10),
      }));
    } catch (err) {
      console.log("pickImages error", err);
      setSnack({
        visible: true,
        message: "Failed to pick images",
        type: "error",
      });
    }
  };

  const removeImage = (uri) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== uri),
    }));
  };

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = "Required";
    if (!form.description.trim()) err.description = "Required";
    if (!form.category.trim()) err.category = "Required";
    if (!form.date.trim()) err.date = "Required";
    if (!form.time.trim()) err.time = "Required";
    if (form.images.length < 4) err.images = "Add at least 4 images";

    // Basic phone number validation
    if (form.contact && !/^[0-9]{10}$/.test(form.contact))
      err.contact = "Enter valid 10-digit mobile number";

    return err;
  };

  const errors = validate();

  async function uploadLocalImageToCloudinary(uri) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary config missing");
    }

    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

    const data = new FormData();
    data.append("file", `data:image/jpg;base64,${base64}`);
    data.append("upload_preset", UPLOAD_PRESET);

    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: data,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error?.message || "Cloudinary upload failed");
    }

    return json.secure_url;
  }

  const submit = async () => {
    setTouched({
      title: true,
      description: true,
      category: true,
      date: true,
      time: true,
      images: true,
    });

    if (Object.keys(errors).length > 0) {
      setSnack({ visible: true, message: "Fix errors first!", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const localUris = form.images.filter((u) => !/^https?:\/\//i.test(u));
      const alreadyUrls = form.images.filter((u) => /^https?:\/\//i.test(u));

      if (localUris.length === 0) {
        await sendEventToServer([...alreadyUrls]);
        setLoading(false);
        return;
      }

      setTotalToUpload(localUris.length);
      setUploadingCount(0);

      const uploadedUrls = [];

      for (let i = 0; i < localUris.length; i++) {
        const uri = localUris[i];

        try {
          const url = await uploadLocalImageToCloudinary(uri);
          uploadedUrls.push(url);
        } catch (err) {
          console.log("Upload failed", err);
          setSnack({ visible: true, message: "Image upload failed", type: "error" });
          setLoading(false);
          return;
        } finally {
          setUploadingCount((c) => c + 1);
        }
      }

      const finalUrls = [];

      let uploadIndex = 0;
      for (const img of form.images) {
        if (/^https?:\/\//i.test(img)) finalUrls.push(img);
        else {
          finalUrls.push(uploadedUrls[uploadIndex]);
          uploadIndex++;
        }
      }

      await sendEventToServer(finalUrls);

      setSnack({ visible: true, message: "Event submitted!", type: "success" });
      setLoading(false);
      setTimeout(() => navigation.goBack(), 900);
    } catch (err) {
      console.log(err);
      setSnack({
        visible: true,
        message: err.response?.data?.ERROR || "Failed",
        type: "error",
      });
      setLoading(false);
    }
  };

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
      createdBy: user?.id || null,
    };

    await API.post("/events/request", payload);
  }

  return (
    <>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <Appbar.Header style={{ backgroundColor: "#E91E63" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Host Event"
          titleStyle={{ color: "white", fontWeight: "700", fontSize: 20 }}
        />
      </Appbar.Header>

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.card}>

          <Text style={styles.title}>Create your Event</Text>
          <Text style={styles.subtitle}>Fill details to host a campus event 🎉</Text>

          {/* TITLE */}
          <TextInput
            label="Event Title *"
            mode="outlined"
            style={styles.input}
            value={form.title}
            onChangeText={(v) => handleChange("title", v)}
            onBlur={() => setTouched({ ...touched, title: true })}
          />
          <HelperText type="error" visible={touched.title && errors.title}>
            {errors.title}
          </HelperText>

          {/* DESCRIPTION */}
          <TextInput
            label="Description *"
            mode="outlined"
            multiline
            style={[styles.input, { height: 100 }]}
            value={form.description}
            onChangeText={(v) => handleChange("description", v)}
            onBlur={() => setTouched({ ...touched, description: true })}
          />
          <HelperText type="error" visible={touched.description && errors.description}>
            {errors.description}
          </HelperText>

          {/* CATEGORY DROPDOWN */}
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setCategoryMenuVisible(true)}
                style={styles.dropdown}
              >
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
                }}
              />
            ))}
          </Menu>

          <HelperText type="error" visible={touched.category && errors.category}>
            {errors.category}
          </HelperText>

          {/* DATE PICKER */}
          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            style={styles.dropdown}
          >
            <Text style={{ color: form.date ? "#000" : "#777" }}>
              {form.date || "Select Date *"}
            </Text>
            <IconButton icon="calendar" size={22} />
          </TouchableOpacity>
          <HelperText type="error" visible={touched.date && errors.date}>
            {errors.date}
          </HelperText>

          {datePickerVisible && (
            <DateTimePicker
              value={form.date ? new Date(form.date) : new Date()}
              mode="date"
              display="spinner"
              onChange={(e, selected) => {
                setDatePickerVisible(false);
                if (selected) {
                  handleChange(
                    "date",
                    selected.toISOString().split("T")[0] // YYYY-MM-DD
                  );
                }
              }}
            />
          )}

          {/* TIME PICKER */}
          <TouchableOpacity
            onPress={() => setTimePickerVisible(true)}
            style={styles.dropdown}
          >
            <Text style={{ color: form.time ? "#000" : "#777" }}>
              {form.time || "Select Time *"}
            </Text>
            <IconButton icon="clock" size={22} />
          </TouchableOpacity>
          <HelperText type="error" visible={touched.time && errors.time}>
            {errors.time}
          </HelperText>

          {timePickerVisible && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={(e, selected) => {
                setTimePickerVisible(false);
                if (selected) {
                  const timeString = selected.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  handleChange("time", timeString);
                }
              }}
            />
          )}

          {/* Location */}
          <TextInput
            label="Location"
            mode="outlined"
            style={styles.input}
            value={form.location}
            onChangeText={(v) => handleChange("location", v)}
          />

          {/* Host Name */}
          <TextInput
            label="Host Name"
            mode="outlined"
            style={styles.input}
            value={form.hostName}
            onChangeText={(v) => handleChange("hostName", v)}
          />

          {/* Contact */}
          <TextInput
            label="Contact Number"
            mode="outlined"
            keyboardType="number-pad"
            style={styles.input}
            value={form.contact}
            onChangeText={(v) => handleChange("contact", v)}
          />
          <HelperText type="error" visible={errors.contact}>
            {errors.contact}
          </HelperText>

          {/* IMAGE UPLOAD */}
          <Text style={styles.sectionTitle}>Upload Images *</Text>
          <Text style={styles.sectionSubtitle}>Min 4 images required</Text>

          <View style={styles.imageGrid}>
            {form.images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <IconButton
                  icon="close"
                  size={18}
                  style={styles.removeBtn}
                  onPress={() => removeImage(uri)}
                />
              </View>
            ))}

            {/* ADD MORE */}
            <TouchableOpacity onPress={pickImages} style={styles.addImageBox}>
              <IconButton icon="plus" size={30} iconColor="#E91E63" />
              <Text style={{ color: "#E91E63" }}>Add</Text>
            </TouchableOpacity>
          </View>

          <HelperText type="error" visible={touched.images && errors.images}>
            {errors.images}
          </HelperText>

          {uploadingCount > 0 && (
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <ActivityIndicator animating size={20} />
              <Text style={{ marginLeft: 10 }}>
                Uploading {uploadingCount} / {totalToUpload}
              </Text>
            </View>
          )}

          <Button
            mode="contained"
            loading={loading}
            onPress={submit}
            style={styles.submitBtn}
            buttonColor="#E91E63"
            disabled={loading}
          >
            Submit Event Request
          </Button>
        </Surface>

        <Snackbar visible={snack.visible} onDismiss={() => setSnack({ ...snack, visible: false })}>
          {snack.message}
        </Snackbar>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    padding: 20,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E91E63",
    marginBottom: 2,
  },
  subtitle: { color: "#777", marginBottom: 20 },
  input: { marginBottom: 12 },
  dropdown: {
    height: 55,
    borderWidth: 1,
    borderColor: "#aaa",
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 12 },
  sectionSubtitle: { color: "#777", marginBottom: 8 },
  imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  imageWrapper: { position: "relative" },
  image: {
    width: 95,
    height: 95,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "white",
  },
  addImageBox: {
    width: 95,
    height: 95,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4EC",
  },
  submitBtn: { marginTop: 20, borderRadius: 12, paddingVertical: 8 },
});
