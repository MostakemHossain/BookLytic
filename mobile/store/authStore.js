import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage =
          data?.error?.issues?.[0]?.message ||
          data?.message ||
          "Something went wrong";

        // Show Alert in React Native
        Alert.alert("Registration Failed", errorMessage);
        return;
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.data.user));
      await AsyncStorage.setItem(
        "token",
        JSON.stringify(data.data.accessToken)
      );
      set({
        isLoading: false,
        user: data.data.user,
        token: data.data.accessToken,
      });

      return {
        success: true,
        message: "User registered successfully",
      };
    } catch (error) {
      // Handle error
      console.error(error);
      set({ isLoading: false, error: error.message });
    }
  },
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;
      set({ token: token, user: user });
    } catch (error) {
      // Handle error
      console.error(error);
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      Alert.alert(
        "Logout Successful",
        "You have been logged out. You will be redirected to the login screen."
      )
    
      set({ token: null, user: null });
    } catch (error) {
      // Handle error
      console.error(error);
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage =
          data?.error?.issues?.[0]?.message ||
          data?.message ||
          "Something went wrong";
        Alert.alert("Login Failed", errorMessage);
        return;
      }
      await AsyncStorage.setItem("user", JSON.stringify(data.data.user));
      await AsyncStorage.setItem(
        "token",
        JSON.stringify(data.data.accessToken)
      );
      set({
        isLoading: false,
        user: data.data.user,
        token: data.data.accessToken,
      });
      return {
        success: true,
        message: "User logged in successfully",
      };
    } catch (error) {
      // Handle error
      console.error(error);
      set({ isLoading: false, error: error.message });
    }
  },
}));
