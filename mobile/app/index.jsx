import { Link } from "expo-router";
import { Text, View } from "react-native";
import {useAuthStore} from "../store/authStore"
import { useEffect } from "react";

export default function Index() {
  const {token,user,checkAuth}= useAuthStore();
  console.log(token);
  console.log(user);
  useEffect(()=>{
    checkAuth();

  },[])
  const {}= useAuthStore();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>This is the default screen.</Text>
      <Link  href={"/(auth)/signup"}>
      SignUp
      </Link>
      <Link  href={"/(auth)/signin"}>
      Login
      </Link>
    </View>
  );
}
