import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { formatPublishDate } from "../../lib/utils";

export default function Home() {
  const { token, logout } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const cleanToken = token?.replace(/^"(.*)"$/, "$1");

      const response = await fetch(
        `http://localhost:3000/api/book/get-books?page=${pageNum}`,
        {
          method: "GET",
          headers: {
            Authorization: cleanToken,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const newBooks = data.data.books || [];

      const updatedBooks =
        refresh || pageNum === 1
          ? newBooks
          : [
              ...books,
              ...newBooks.filter(
                (newBook) => !books.some((book) => book._id === newBook._id)
              ),
            ];

      setBooks(updatedBooks);
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log(error.message);
    } finally {
      if (refresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, []);

  const renderRatingStars = (rating) => {
    return Array.from({ length: Math.floor(rating) }, (_, i) => (
      <Ionicons
        key={i}
        name="star"
        size={20}
        color={i < rating ? "#F4b400" : COLORS.textSecondary}
      />
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles?.userInfo}>
          <Image
            source={{ uri: item?.user?.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item?.user?.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={{ uri: item?.image }} style={styles.bookImage} />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item?.title}</Text>

        <Text style={styles.ratingContainer}>
          {renderRatingStars(item?.rating)}
        </Text>

        <Text style={styles.caption}>{item?.caption}</Text>

        <Text style={styles.date}>
          Shared on {formatPublishDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => fetchBooks(1, true)}
        onEndReached={() => {
          if (hasMore && !loading) {
            fetchBooks(page + 1);
          }
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📚 BookLytic 📗</Text>
            <Text style={styles.headerSubtitle}>
              Discover great book from the community👇
            </Text>

          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary}/>
            <Text style={styles.emptyText}>
              No recommendations yet.🥺
            </Text>
            <Text style={styles.emptySubtext}>
              Be the first to share a Book!
            </Text>

          </View>
        }
       
        ListFooterComponent={
          loading ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="large" color={COLORS.primary || "#4B7BE5"} />
            </View>
          ) : null
        }
      />
    </View>
  );
}
