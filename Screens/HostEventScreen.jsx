import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
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
  Chip,
} from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuth } from "../context/UserContext";
import { CLOUD_NAME, UPLOAD_PRESET } from "@env";
import API from "../api/api";

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

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
  subCategories: [],
  date: "",
  time: "",
  location: "",
  hostName: "",
  contact: "",
  email: "",
  images: [],
};

export default function HostEventScreen({ navigation }) {
  const colors = useAppTheme();
  const { user } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM);
  const [subCategoryInput, setSubCategoryInput] = useState("");

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const [snack, setSnack] = useState({ visible: false, message: "" });
  const [loading, setLoading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);

  const handleChange = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // ---------------- VALIDATION ----------------

  const validate = () => {
    const err = {};

    if (!form.title.trim()) err.title = "Required";
    if (!form.description.trim()) err.description = "Required";
    if (!form.category.trim()) err.category = "Required";
    if (!form.date.trim()) err.date = "Required";
    if (!form.time.trim()) err.time = "Required";

    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Enter valid email";

    if (form.images.length < 4) err.images = "Add at least 4 images";

    if (form.contact && !/^[0-9]{10}$/.test(form.contact))
      err.contact = "Enter valid 10-digit number";

    return err;
  };

  const errors = validate();

  // ---------------- SUB CATEGORY ----------------

  const addSubCategory = () => {
    const v = subCategoryInput.trim();
    if (!v || form.subCategories.includes(v)) return;

    setForm((p) => ({
      ...p,
      subCategories: [...p.subCategories, v],
    }));

    setSubCategoryInput("");
  };

  const removeSubCategory = (val) =>
    setForm((p) => ({
      ...p,
      subCategories: p.subCategories.filter((s) => s !== val),
    }));

  // ---------------- IMAGE PICKER ----------------

  const pickImages = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setSnack({
          visible: true,
          message: "Gallery permission required",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.8,
      });

      if (!result || result.canceled) return;

      const uris = result.assets.map((a) => a.uri);

      setForm((p) => ({
        ...p,
        images: [...p.images, ...uris].slice(0, 10),
      }));
    } catch (err) {
      console.log("pickImages error", err);
      setSnack({ visible: true, message: "Failed to pick images" });
    }
  };

  const removeImage = (uri) =>
    setForm((p) => ({
      ...p,
      images: p.images.filter((i) => i !== uri),
    }));

  // ---------------- CLOUD UPLOAD ----------------

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

  async function sendEventToServer(imageUrls) {
    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
      imageUrls,
      createdBy: user?.id ?? null,
    };

    await API.post("/events/request", payload);
  }

  // ---------------- SUBMIT ----------------

  const submit = async () => {
    if (!user || Object.keys(errors).length) return;

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

      await sendEventToServer(uploaded);

      setSnack({
        visible: true,
        message: "Event submitted successfully!",
      });
    } finally {
      setLoading(false);
      setUploadingCount(0);
      setTotalToUpload(0);
    }
  };

  const goToPreview = () => {
    if (Object.keys(errors).length) {
      setSnack({ visible: true, message: "Fix errors first" });
      return;
    }

    navigation.navigate("EventPreview", {
      form,
      onPublish: submit,
    });
  };

  // ---------------- UI ----------------

  return (
    <>
      <StatusBar barStyle="light-content" />

      <Appbar.Header elevated style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction
          color={colors.textPrimary}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Host Event"
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
              backgroundColor: colors.surface,
              borderRadius: Radius.xl,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.primary }]}>
            Create your Event
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Fill details to host a campus event 🎉
          </Text>

          {/* FORM INPUTS */}

          <TextInput
            label="Event Title *"
            mode="outlined"
            style={styles.input}
            value={form.title}
            onChangeText={(v) => handleChange("title", v)}
          />
          <HelperText visible={!!errors.title} type="error">
            {errors.title}
          </HelperText>

          <TextInput
            label="Description *"
            mode="outlined"
            multiline
            style={[styles.input, { height: scale(100) }]}
            value={form.description}
            onChangeText={(v) => handleChange("description", v)}
          />
          <HelperText visible={!!errors.description} type="error">
            {errors.description}
          </HelperText>

          {/* CATEGORY */}

          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={[styles.dropdown, { borderColor: colors.border }]}
                onPress={() => setCategoryMenuVisible(true)}
              >
                <Text
                  style={{
                    color: form.category
                      ? colors.textPrimary
                      : colors.textSecondary,
                  }}
                >
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
                  setForm((p) => ({
                    ...p,
                    category: c,
                    subCategories: [],
                  }));
                  setCategoryMenuVisible(false);
                }}
              />
            ))}
          </Menu>

          <HelperText visible={!!errors.category} type="error">
            {errors.category}
          </HelperText>

          {form.category !== "" && (
            <>
              <TextInput
                label="Add Sub Category"
                mode="outlined"
                style={styles.input}
                value={subCategoryInput}
                onChangeText={setSubCategoryInput}
                right={<TextInput.Icon icon="plus" onPress={addSubCategory} />}
              />

              <View style={styles.chipWrap}>
                {form.subCategories.map((s) => (
                  <Chip
                    key={s}
                    style={styles.chip}
                    onClose={() => removeSubCategory(s)}
                  >
                    {s}
                  </Chip>
                ))}
              </View>
            </>
          )}

          {/* DATE */}

          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            style={[styles.dropdown, { borderColor: colors.border }]}
          >
            <Text
              style={{
                color: form.date ? colors.textPrimary : colors.textSecondary,
              }}
            >
              {form.date || "Select Date *"}
            </Text>
            <IconButton icon="calendar" size={22} />
          </TouchableOpacity>

          {datePickerVisible && (
            <DateTimePicker
              value={form.date ? new Date(form.date) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, d) => {
                setDatePickerVisible(false);
                if (d) handleChange("date", d.toISOString().split("T")[0]);
              }}
            />
          )}

          <HelperText visible={!!errors.date} type="error">
            {errors.date}
          </HelperText>

          {/* TIME */}

          <TouchableOpacity
            onPress={() => setTimePickerVisible(true)}
            style={[styles.dropdown, { borderColor: colors.border }]}
          >
            <Text
              style={{
                color: form.time ? colors.textPrimary : colors.textSecondary,
              }}
            >
              {form.time || "Select Time *"}
            </Text>
            <IconButton icon="clock" size={22} />
          </TouchableOpacity>

          {timePickerVisible && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, d) => {
                setTimePickerVisible(false);
                if (d)
                  handleChange(
                    "time",
                    d.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  );
              }}
            />
          )}

          <HelperText visible={!!errors.time} type="error">
            {errors.time}
          </HelperText>

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
            label="Contact Number"
            mode="outlined"
            keyboardType="number-pad"
            style={styles.input}
            value={form.contact}
            onChangeText={(v) => handleChange("contact", v)}
          />
          <HelperText visible={!!errors.contact} type="error">
            {errors.contact}
          </HelperText>

          <TextInput
            label="Email Address *"
            mode="outlined"
            style={styles.input}
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
          />
          <HelperText visible={!!errors.email} type="error">
            {errors.email}
          </HelperText>

          {/* IMAGES */}

          <Text style={styles.sectionTitle}>Upload Images *</Text>

          <Text style={styles.sectionSubtitle}>Minimum 4 required</Text>

          <View style={styles.imageGrid}>
            {form.images.map((uri, i) => (
              <View key={uri + i} style={styles.imageBox}>
                <Image
                  source={{ uri }}
                  style={[styles.image, { borderColor: colors.border }]}
                />

                <IconButton
                  icon="close"
                  size={18}
                  style={[
                    styles.removeBtn,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => removeImage(uri)}
                />
              </View>
            ))}

            {form.images.length < 10 && (
              <TouchableOpacity
                style={[
                  styles.addBox,
                  {
                    borderColor: colors.primary,
                    backgroundColor: colors.background,
                  },
                ]}
                onPress={pickImages}
              >
                <IconButton icon="plus" size={30} iconColor={colors.primary} />
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: Fonts.weight.semiBold,
                  }}
                >
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <HelperText visible={!!errors.images} type="error">
            {errors.images}
          </HelperText>

          {/* UPLOAD STATUS */}

          {uploadingCount > 0 && (
            <View style={styles.uploadRow}>
              <ActivityIndicator size={20} />
              <Text style={{ marginLeft: Spacing.sm }}>
                Uploading {uploadingCount} / {totalToUpload}
              </Text>
            </View>
          )}

          {/* SUBMIT */}

          <Button
            mode="contained"
            buttonColor={colors.primary}
            loading={loading}
            onPress={goToPreview}
            style={styles.submitBtn}
          >
            Preview Event
          </Button>
        </Surface>

        <Snackbar
          visible={snack.visible}
          onDismiss={() => setSnack((s) => ({ ...s, visible: false }))}
        >
          {snack.message}
        </Snackbar>
      </ScrollView>
    </>
  );
}

// --------------------------------------------------

const IMAGE_SIZE = scale(95);

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingBottom: scale(40),
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
    marginBottom: Spacing.lg,
    fontSize: Fonts.size.md,
  },

  input: {
    marginBottom: Spacing.sm,
  },

  dropdown: {
    height: scale(55),
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.bold,
    marginTop: Spacing.md,
  },

  sectionSubtitle: {
    color: "#777",
    marginBottom: Spacing.sm,
  },

  submitBtn: {
    marginTop: Spacing.lg,
    borderRadius: Radius.md,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.sm,
  },

  chip: {
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },

  imageBox: {
    position: "relative",
  },

  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: Radius.md,
    borderWidth: 1,
  },

  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
  },

  addBox: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: Radius.md,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
});
