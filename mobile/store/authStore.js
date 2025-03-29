import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


export const useAuthStore = create((set) => ({
    user: null,
    token:null, 
    isLoading:false,
   register: async (username,email,password)=> {
    set({ isLoading: true });
    try {
        
        const response = await fetch("http://localhost:3000/api/auth/register",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, email, password})
        })
       

        const data = await response.json();
        if (!response.ok) {
            const errorMessage = data?.error?.issues?.[0]?.message || data?.message || "Something went wrong";

            // Show Alert in React Native
            Alert.alert("Registration Failed", errorMessage);
            return;
        }
        
       await AsyncStorage.setItem("user",JSON.stringify(data.data.user));
       await AsyncStorage.setItem("token",JSON.stringify(data.data.accessToken));
       set({ isLoading: false, user: data.data.user, token: data.data.accessToken});

       return {
         success: true,
         message: "User registered successfully",
       }
     
        
    } catch (error) {
        // Handle error
        console.error(error);
        set({ isLoading: false, error: error.message });
        
    }
   }

}));

