import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import Logout from "../../components/Logout";
export default function Profile() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter([]);
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
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <View style={styles.container}>
      <ProfileHeader/>
      <Logout/>
    </View>
  );
}
