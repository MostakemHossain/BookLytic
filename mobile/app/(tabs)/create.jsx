import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "../../store/authStore";

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(3);

  const { token } = useAuthStore();

  const router = useRouter();

  const pickImage = async () => {
    try {
      // Request permission if needed
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to access your photos."
          );
          return;
        }

        // Launch the image library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.3,
          base64: true,
        });

        if (!result.canceled) {
          setImage(result.assets[0].uri);

          // If base64 is provided, use it
          if (result.assets[0].base64) {
            setImageBase64(result.assets[0].base64);
          } else {
            // Convert image to base64 manually if not provided
            const base64 = await FileSystem.readAsStringAsync(
              result.assets[0].uri,
              {
                encoding: FileSystem.EncodingType.Base64,
              }
            );
            setImageBase64(base64);
          }
        }
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      setIsLoading(true);

      // get file extension from URI or default to png
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/png";
      // base64 image data url
      const imageDatUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch(
        "http://localhost:3000/api/book/create-book",
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            caption,
            image: imageDatUrl,
            rating,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.message);
        setIsLoading(false);
        return;
      }
      Alert.alert("Success", "Book created successfully");
      setIsLoading(false);
      // reset all fields
      setTitle("");
      setCaption("");
      setImage(null);
      setImageBase64(null);
      setRating(3);
      router.push("/");
    } catch (error) {
      Alert.alert("Error", "An error occurred while creating the book");
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite read with others.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Book Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* Book Rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }, (_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.starButton,
                      i < rating && styles.activeRatingButton,
                    ]}
                    onPress={() => setRating(i + 1)}
                  >
                    <Ionicons
                      name={i < rating ? "star" : "star-outline"}
                      size={32}
                      color={i < rating ? "#f4b400" : COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to select image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/* Book Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter a caption for your book recommendation"
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline={true}
              />
            </View>
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={24}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
