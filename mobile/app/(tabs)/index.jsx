"use client";

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { formatPublishDate } from "../../lib/utils";
import Loader from "../../components/Loader";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const API_BASE_URL = "http://localhost:3000";

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoading(true);
      }

      console.log(`Fetching books for page ${pageNum}, refresh: ${refresh}`);

      const cleanToken = token?.replace(/^"(.*)"$/, "$1");
      if (!cleanToken) {
        console.warn("No token found. Skipping fetch.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/book/get-books?page=${pageNum}&limit=5`,
        {
          method: "GET",
          headers: {
            Authorization: cleanToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", {
        status: response.status,
        books: data.data?.books?.length || 0,
        totalPages: data.totalPages,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch books: ${data.message || response.statusText}`
        );
      }

      const newBooks = data.data?.books || [];

      setBooks((prevBooks) => {
        if (refresh || pageNum === 1) return newBooks;
        const uniqueBooks = newBooks.filter(
          (newBook) => !prevBooks.some((book) => book._id === newBook._id)
        );

        console.log(
          `Adding ${uniqueBooks.length} new books to existing ${prevBooks.length}`
        );
        return [...prevBooks, ...uniqueBooks];
      });

      setHasMore(
        data.totalPages ? pageNum < data.totalPages : newBooks.length > 0
      );
      setPage(pageNum);
    } catch (error) {
      console.error(error.message);
    } finally {
      if (refresh) {
       await sleep(800);
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, []);

  if (loading) return <Loader />;

  const handleLoadMore = async () => {
    console.log("Load more triggered", { loading, refreshing, hasMore, page });
    if (!loading && !refreshing && hasMore) {
      sleep(1000);
      await fetchBooks(page + 1);
    }
  };

  const renderRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < Math.floor(rating) ? "star" : "star-outline"}
        size={20}
        color={i < Math.floor(rating) ? "#F4b400" : COLORS.textSecondary}
      />
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item?.user?.profileImage }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.username}>{item?.user?.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: item?.image }}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item?.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item?.rating)}
        </View>
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
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onRefresh={() => fetchBooks(1, true)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📚 BookLytic 📗</Text>
            <Text style={styles.headerSubtitle}>
              Discover great books from the community 👇
            </Text>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="book-outline"
                size={60}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyText}>No recommendations yet. 🥺</Text>
              <Text style={styles.emptySubtext}>
                Be the first to share a book!
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator
                size="large"
                color={COLORS.primary || "#4B7BE5"}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}
