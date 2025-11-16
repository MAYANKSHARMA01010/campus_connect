import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Surface,
  Snackbar,
  IconButton,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function HostEventScreen({ navigation }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    hostName: "",
    contact: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ visible: false, message: "", type: "info" });
  const [touched, setTouched] = useState({});

  const handleChange = (k, v) => setForm({ ...form, [k]: v });

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 10,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((img) => img.uri);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uris].slice(0, 10),
      }));
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

      const res = await API.post("/events/request", {
        ...form,
        createdBy: user?.id || null,
      });

      setSnack({ visible: true, message: "Event request submitted!", type: "success" });
      setLoading(false);
      setTimeout(() => navigation.goBack(), 1200);
    } catch (err) {
      setSnack({
        visible: true,
        message: err.response?.data?.ERROR || "Failed",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.card}>
        <Text style={styles.title}>Host an Event</Text>

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
          style={[styles.input, { height: 90 }]}
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

        <Text style={styles.subHeading}>Upload Event Images (min 4) *</Text>

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

          <TouchableOpacity onPress={pickImages} style={styles.addImageBox}>
            <Text style={{ color: "#E91E63" }}>+ Add Images</Text>
          </TouchableOpacity>
        </View>

        <HelperText type="error" visible={touched.images && errors.images}>
          {errors.images}
        </HelperText>

        <Button
          mode="contained"
          loading={loading}
          onPress={submit}
          style={styles.submitBtn}
          buttonColor="#E91E63"
        >
          Submit Event Request
        </Button>
      </Surface>

      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ ...snack, visible: false })}
      >
        {snack.message}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { padding: 18, borderRadius: 14, elevation: 3 },
  title: { fontSize: 20, fontWeight: "700", color: "#E91E63", marginBottom: 10 },
  input: { marginBottom: 12 },
  subHeading: { fontWeight: "600", marginTop: 12, marginBottom: 6, color: "#444" },
  imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  imageWrapper: { position: "relative" },
  image: { width: 90, height: 90, borderRadius: 10 },
  removeBtn: { position: "absolute", top: -8, right: -8, backgroundColor: "#fff" },
  addImageBox: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: { marginTop: 16, borderRadius: 10 },
});
