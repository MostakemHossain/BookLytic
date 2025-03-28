import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';  
import styles from "../../assets/styles/login.styles";
import COLORS from '../../constants/colors';
import { Link } from 'expo-router';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = ()=>{
      
    }

    return (
        <KeyboardAvoidingView
        style={{flex:1}}
        behavior={Platform.OS==="ios"?"padding":"height"}
        >
          <View style={styles.container}>
            {/* Illustration */}
            <View style={styles.topIllustration}>
                <Image
                    source={require('../../assets/login.png')}
                    style={styles.illustrationImage}
                    resizeMode="contain"
                />
            </View>

            {/* Login Form */}
            <View style={styles.card}>
                <View style={styles.formContainer}>
                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor={COLORS.placeholderText}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor={COLORS.placeholderText}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                keyboardType="default"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href={"/(auth)/signup"}>
                        <Text style={styles.link}>Sign Up</Text>
                    </Link>
                </View>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
}
