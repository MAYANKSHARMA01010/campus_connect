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

    if (form.images.length < 4)
      err.images = "Add at least 4 images";

    if (form.contact && !/^[0-9]{10}$/.test(form.contact))
      err.contact = "Enter valid 10-digit number";

    return err;
  };

  const errors = validate();

  const addSubCategory = () => {
    const v = subCategoryInput.trim();
    if (!v) return;

    if (form.subCategories.includes(v)) {
      setSubCategoryInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, v],
    }));

    setSubCategoryInput("");
  };

  const removeSubCategory = (val) =>
    setForm((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter(
        (s) => s !== val
      ),
    }));

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

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit: 10,
          quality: 0.8,
        });

      if (!result || result.canceled) return;

      const uris = result.assets.map(
        (a) => a.uri
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uris].slice(
          0,
          10
        ),
      }));
    } catch (err) {
      console.log("pickImages error", err);
      setSnack({
        visible: true,
        message: "Failed to pick images",
      });
    }
  };

  const removeImage = (uri) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter(
        (i) => i !== uri
      ),
    }));

  async function uploadLocalImage(uri) {
    if (!CLOUD_NAME || !UPLOAD_PRESET)
      throw new Error(
        "Cloudinary config missing"
      );

    const name = uri.split("/").pop();
    const ext = name.split(".").pop() || "jpg";

    const data = new FormData();
    data.append("file", {
      uri:
        Platform.OS === "android"
          ? uri
          : uri.replace("file://", ""),
      name,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });

    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const json = await res.json();
    if (!res.ok)
      throw new Error(
        json?.error?.message ||
        "Image upload failed"
      );

    return json.secure_url;
  }

  async function sendEventToServer(imageUrls) {
    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
      imageUrls,
      createdBy: user?.id ?? null,
    };

    await API.post(
      "/events/request",
      payload
    );
  }

  const submit = async () => {
    if (!user || Object.keys(errors).length)
      return;

    setLoading(true);

    try {
      const localImages = form.images.filter(
        (u) => !/^https?:\/\//.test(u)
      );

      setUploadingCount(0);
      setTotalToUpload(localImages.length);

      const uploaded = [];

      for (let img of localImages) {
        const url =
          await uploadLocalImage(img);
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
      setSnack({
        visible: true,
        message: "Fix errors first",
      });
      return;
    }

    navigation.navigate("EventPreview", {
      form,
      onPublish: submit,
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <Appbar.Header style={{ backgroundColor: "#E91E63" }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Host Event"
          color="white"
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.card}>
          <Text style={styles.title}>
            Create your Event
          </Text>

          <Text style={styles.subtitle}>
            Fill details to host a campus
            event 🎉
          </Text>

          <TextInput
            label="Event Title *"
            mode="outlined"
            style={styles.input}
            value={form.title}
            onChangeText={(v) =>
              handleChange("title", v)
            }
          />
          <HelperText
            visible={!!errors.title}
            type="error"
          >
            {errors.title}
          </HelperText>

          <TextInput
            label="Description *"
            mode="outlined"
            multiline
            style={[
              styles.input,
              { height: 100 },
            ]}
            value={form.description}
            onChangeText={(v) =>
              handleChange("description", v)
            }
          />
          <HelperText
            visible={!!errors.description}
            type="error"
          >
            {errors.description}
          </HelperText>

          <Menu
            visible={categoryMenuVisible}
            onDismiss={() =>
              setCategoryMenuVisible(false)
            }
            anchor={
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() =>
                  setCategoryMenuVisible(true)
                }
              >
                <Text
                  style={{
                    color: form.category
                      ? "#000"
                      : "#777",
                  }}
                >
                  {form.category ||
                    "Select Category *"}
                </Text>
                <IconButton
                  icon="chevron-down"
                  size={22}
                />
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

          <HelperText
            visible={!!errors.category}
            type="error"
          >
            {errors.category}
          </HelperText>

          {form.category !== "" && (
            <>
              <TextInput
                label="Add Sub Category"
                mode="outlined"
                style={styles.input}
                value={subCategoryInput}
                onChangeText={
                  setSubCategoryInput
                }
                right={
                  <TextInput.Icon
                    icon="plus"
                    onPress={
                      addSubCategory
                    }
                  />
                }
              />

              <View style={styles.chipWrap}>
                {form.subCategories.map(
                  (s) => (
                    <Chip
                      key={s}
                      style={styles.chip}
                      onClose={() =>
                        removeSubCategory(
                          s
                        )
                      }
                    >
                      {s}
                    </Chip>
                  )
                )}
              </View>
            </>
          )}

          <TouchableOpacity
            onPress={() =>
              setDatePickerVisible(true)
            }
            style={styles.dropdown}
          >
            <Text
              style={{
                color: form.date
                  ? "#000"
                  : "#777",
              }}
            >
              {form.date ||
                "Select Date *"}
            </Text>

            <IconButton
              icon="calendar"
              size={22}
            />
          </TouchableOpacity>

          {datePickerVisible && (
            <DateTimePicker
              value={
                form.date
                  ? new Date(form.date)
                  : new Date()
              }
              mode="date"
              display={
                Platform.OS === "ios"
                  ? "spinner"
                  : "default"
              }
              onChange={(e, d) => {
                setDatePickerVisible(
                  false
                );
                if (d)
                  handleChange(
                    "date",
                    d
                      .toISOString()
                      .split("T")[0]
                  );
              }}
            />
          )}

          <HelperText
            visible={!!errors.date}
            type="error"
          >
            {errors.date}
          </HelperText>

          <TouchableOpacity
            onPress={() =>
              setTimePickerVisible(
                true
              )
            }
            style={styles.dropdown}
          >
            <Text
              style={{
                color: form.time
                  ? "#000"
                  : "#777",
              }}
            >
              {form.time ||
                "Select Time *"}
            </Text>

            <IconButton
              icon="clock"
              size={22}
            />
          </TouchableOpacity>

          {timePickerVisible && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display={
                Platform.OS === "ios"
                  ? "spinner"
                  : "default"
              }
              onChange={(e, d) => {
                setTimePickerVisible(
                  false
                );
                if (d)
                  handleChange(
                    "time",
                    d.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute:
                          "2-digit",
                      }
                    )
                  );
              }}
            />
          )}

          <HelperText
            visible={!!errors.time}
            type="error"
          >
            {errors.time}
          </HelperText>

          <TextInput
            label="Location"
            mode="outlined"
            style={styles.input}
            value={form.location}
            onChangeText={(v) =>
              handleChange("location", v)
            }
          />

          <TextInput
            label="Host Name"
            mode="outlined"
            style={styles.input}
            value={form.hostName}
            onChangeText={(v) =>
              handleChange(
                "hostName",
                v
              )
            }
          />

          <TextInput
            label="Contact Number"
            mode="outlined"
            keyboardType="number-pad"
            style={styles.input}
            value={form.contact}
            onChangeText={(v) =>
              handleChange(
                "contact",
                v
              )
            }
          />
          <HelperText
            visible={!!errors.contact}
            type="error"
          >
            {errors.contact}
          </HelperText>

          <TextInput
            label="Email Address *"
            mode="outlined"
            style={styles.input}
            value={form.email}
            onChangeText={(v) =>
              handleChange("email", v)
            }
          />
          <HelperText
            visible={!!errors.email}
            type="error"
          >
            {errors.email}
          </HelperText>

          <Text style={styles.sectionTitle}>
            Upload Images *
          </Text>

          <Text style={styles.sectionSubtitle}>
            Minimum 4 required
          </Text>

          <View style={styles.imageGrid}>
            {form.images.map((uri, i) => (
              <View
                key={uri + i}
                style={styles.imageBox}
              >
                <Image
                  source={{ uri }}
                  style={styles.image}
                />

                <IconButton
                  icon="close"
                  size={18}
                  style={styles.removeBtn}
                  onPress={() =>
                    removeImage(uri)
                  }
                />
              </View>
            ))}

            {form.images.length < 10 && (
              <TouchableOpacity
                style={styles.addBox}
                onPress={pickImages}
              >
                <IconButton
                  icon="plus"
                  size={30}
                  iconColor="#E91E63"
                />
                <Text
                  style={{
                    color: "#E91E63",
                    fontWeight: "600",
                  }}
                >
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <HelperText
            visible={!!errors.images}
            type="error"
          >
            {errors.images}
          </HelperText>

          {uploadingCount > 0 && (
            <View
              style={{
                flexDirection:
                  "row",
                marginTop: 8,
              }}
            >
              <ActivityIndicator size={20} />
              <Text
                style={{
                  marginLeft: 10,
                }}
              >
                Uploading {uploadingCount} /{" "}
                {totalToUpload}
              </Text>
            </View>
          )}

          <Button
            mode="contained"
            buttonColor="#E91E63"
            loading={loading}
            onPress={goToPreview}
            style={styles.submitBtn}
          >
            Preview Event
          </Button>
        </Surface>

        <Snackbar
          visible={snack.visible}
          onDismiss={() =>
            setSnack((s) => ({
              ...s,
              visible: false,
            }))
          }
        >
          {snack.message}
        </Snackbar>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "white",
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#E91E63",
  },

  subtitle: {
    color: "#777",
    marginBottom: 20,
  },

  input: {
    marginBottom: 12,
    backgroundColor: "#FAFAFA",
  },

  dropdown: {
    height: 55,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },

  sectionSubtitle: {
    color: "#777",
    marginBottom: 8,
  },

  submitBtn: {
    marginTop: 20,
    borderRadius: 12,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  chip: {
    marginRight: 8,
    marginBottom: 8,
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  imageBox: {
    position: "relative",
  },

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

  addBox: {
    width: 95,
    height: 95,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4EC",
  },
});
