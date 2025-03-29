import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const insets= useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:COLORS.primary,
        headerTitleStyle:{
            color:COLORS.primary,
            fontWeight: "600",
         
        },
        headerShadowVisible:false,
        tabBarStyle:{
            backgroundColor:COLORS.cardBackground,
            borderTopWidth:1,
            borderTopColor:COLORS.border,
         
            paddingTop:5,
            height:60 + insets.bottom,
            paddingBottom: insets.bottom
          
        },

       
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="home-outline" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="add-circle-outline" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="person-outline" size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
