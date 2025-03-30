import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import {useAuthStore} from "../store/authStore"
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth,token,user}= useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[])

  // handle navigation based on the  auth state
  useEffect(()=>{
    const isAuthScreen= segments[0]==="(auth)";
    const isSignedIn= user && token;
    
   
    if(!isAuthScreen &&!isSignedIn){
      router.replace("/(auth)/signin");
    }else if(isAuthScreen && isSignedIn){
      router.replace("/(tabs)");
    }
  },
  [token,user,segments]);

  
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Add your screens here */}
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar barStyle="dark-content" />
    </SafeAreaProvider>
  );
}
