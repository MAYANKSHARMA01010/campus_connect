import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Text as RNText,
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
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import API from "../api/api";
import { useAuth } from "../context/UserContext";

const CLOUD_NAME = process.env.CLOUD_NAME;
const UPLOAD_PRESET = process.env.UPLOAD_PRESET;

const initialForm = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  location: "",
  hostName: "",
  contact: "",
  images: [
    "/mnt/data/Screenshot 2025-11-25 at 10.50.03 PM.png",
  ],
};

export default function HostEventScreen({ navigation }) {
  const { user } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ visible: false, message: "", type: "info" });
  const [touched, setTouched] = useState({});
  const [uploadingCount, setUploadingCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);

  const handleChange = (k, v) => setForm({ ...form, [k]: v });

  const pickImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!(permission?.granted || permission?.status === "granted")) {
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

      if (result.canceled === false && Array.isArray(result.assets)) {
        const uris = result.assets.map((img) => img.uri);
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...uris].slice(0, 10),
        }));
      }

      else if (result.cancelled === false && result.uri) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, result.uri].slice(0, 10),
        }));
      }
    } 
    catch (err) {
      console.error("pickImages error", err);
      setSnack({ visible: true, message: "Failed to pick images", type: "error" });
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
    if (form.images.length < 4) err.images = "Add at least 4 images";
    return err;
  };

  const errors = validate();

  async function uploadLocalImageToCloudinary(uri) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary config missing (CLOUD_NAME or UPLOAD_PRESET)");
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
        }
        catch (err) {
          console.error("Upload failed for", uri, err);
          setSnack({ visible: true, message: "Image upload failed", type: "error" });
          setLoading(false);
          setUploadingCount(0);
          setTotalToUpload(0);
          return;
        }
        finally {
          setUploadingCount((c) => c + 1);
        }
      }

      const finalUrls = [];
      let uploadIndex = 0;
      for (const img of form.images) {
        if (/^https?:\/\//i.test(img)) {
          finalUrls.push(img);
        } else {
          finalUrls.push(uploadedUrls[uploadIndex]);
          uploadIndex++;
        }
      }

      await sendEventToServer(finalUrls);

      setSnack({ visible: true, message: "Event request submitted!", type: "success" });
      setLoading(false);
      setTimeout(() => navigation.goBack(), 900);
    } catch (err) {
      console.error(err);
      setSnack({
        visible: true,
        message: err.response?.data?.ERROR || err.message || "Failed",
        type: "error",
      });
      setLoading(false);
      setUploadingCount(0);
      setTotalToUpload(0);
    }
  };

  async function sendEventToServer(imageUrls) {
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      date: form.date ? new Date(form.date).toISOString() : null,
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

      <Appbar.Header style={{ backgroundColor: "#E91E63", elevation: 10 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Host an Event"
          titleStyle={{ fontSize: 20, fontWeight: "700", color: "white" }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.card}>
          <Text style={styles.pageTitle}>Create Your Event</Text>
          <Text style={styles.pageSubtitle}>Fill the details below to host a campus event 🎉</Text>

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

          <TextInput
            label="Description *"
            mode="outlined"
            multiline
            style={[styles.input, { height: 95 }]}
            value={form.description}
            onChangeText={(v) => handleChange("description", v)}
            onBlur={() => setTouched({ ...touched, description: true })}
          />
          <HelperText type="error" visible={touched.description && errors.description}>
            {errors.description}
          </HelperText>

          <TextInput
            label="Category *"
            mode="outlined"
            style={styles.input}
            value={form.category}
            onChangeText={(v) => handleChange("category", v)}
            onBlur={() => setTouched({ ...touched, category: true })}
          />
          <HelperText type="error" visible={touched.category && errors.category}>
            {errors.category}
          </HelperText>

          <TextInput
            label="Date (YYYY-MM-DD) *"
            mode="outlined"
            style={styles.input}
            value={form.date}
            onChangeText={(v) => handleChange("date", v)}
            onBlur={() => setTouched({ ...touched, date: true })}
          />
          <HelperText type="error" visible={touched.date && errors.date}>
            {errors.date}
          </HelperText>

          <TextInput
            label="Time"
            mode="outlined"
            style={styles.input}
            value={form.time}
            onChangeText={(v) => handleChange("time", v)}
          />

          <TextInput
            label="Location"
            mode="outlined"
            style={styles.input}
            value={form.location}
            onChangeText={(v) => handleChange("location", v)}
          />

          <TextInput
            label="Host Name"
            mode="outlined"
            style={styles.input}
            value={form.hostName}
            onChangeText={(v) => handleChange("hostName", v)}
          />

          <TextInput
            label="Contact"
            mode="outlined"
            style={styles.input}
            value={form.contact}
            onChangeText={(v) => handleChange("contact", v)}
          />

          <Text style={styles.sectionTitle}>Upload Event Images *</Text>
          <Text style={styles.sectionSubtitle}>Minimum 4 images required</Text>

          <View style={styles.imageGrid}>
            {form.images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: /^https?:\/\//i.test(uri) ? uri : uri }}
                  style={styles.image}
                />
                <IconButton
                  icon="close"
                  size={18}
                  style={styles.removeBtn}
                  onPress={() => removeImage(uri)}
                />
              </View>
            ))}

            <TouchableOpacity onPress={pickImages} style={styles.addImageBox}>
              <IconButton icon="plus" size={32} iconColor="#E91E63" />
              <Text style={{ color: "#E91E63", fontWeight: "600" }}>Add</Text>
            </TouchableOpacity>
          </View>

          <HelperText type="error" visible={touched.images && errors.images}>
            {errors.images}
          </HelperText>

          {uploadingCount > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <ActivityIndicator animating={true} size={20} />
              <RNText style={{ marginLeft: 8 }}>
                Uploading {uploadingCount} / {totalToUpload}
              </RNText>
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
  container: {
    padding: 16,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    elevation: 6,
    marginTop: 10,
    backgroundColor: "white",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E91E63",
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    color: "#333",
  },
  sectionSubtitle: {
    color: "#777",
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
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
  submitBtn: {
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
