"use client";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import Logout from "../../components/Logout";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { Image } from "expo-image";
import { renderRatingStars } from "../../lib/utils";
import Loader from "../../components/Loader";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const { token } = useAuthStore();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const cleanToken = token?.replace(/^"(.*)"$/, "$1");
      if (!cleanToken) {
        console.warn("No token found. Skipping fetch.");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/book/get`, {
        method: "GET",
        headers: {
          Authorization: cleanToken,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `Failed to fetch books: ${data.message || response.statusText}`
        );
      }

      setBooks(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleDeleteBook = async (bookId) => {
    try {
      setLoading(true);
      const cleanToken = token?.replace(/^"(.*)"$/, "$1");
      if (!cleanToken) {
        console.warn("No token found. Skipping fetch.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/book/delete-book/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: cleanToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          `Failed to delete book: ${data.message || response.statusText}`
        );
      }
      Alert.alert("Success", "Book deleted successfully");
      fetchBooks();
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (bookId) => {
    Alert.alert(
      "Delete Recommendations",
      "Are you sure you want to delete this recommendation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteBook(bookId),
        },
      ]
    );
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </Text>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(1000);
    await fetchBooks();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <Logout />
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recommendations 📚</Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet.🙁</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
