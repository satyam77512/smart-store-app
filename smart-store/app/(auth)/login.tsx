import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ToastAndroid, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/Context/UserContext';
import * as Network from 'expo-network'

import { COLORS } from '@/constants/theme';


const Login = () => {
    
    const [Loginid, setLoginid] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { isLoggedIn, login ,backendHost,host} = useUser();

    useEffect(() => {
        if (isLoggedIn) {
            router.replace('/(tabs)');
        }
    }, [isLoggedIn]);

    useEffect(()=>{
        const findBackend = async ()=>{
            var deviceIp = await Network.getIpAddressAsync();
            const subnet = deviceIp.split('.').slice(0, 3).join('.'); // "192.168.29"

            for (let i = 2; i < 255; i++) {
                const testIp = `${subnet}.${i}`;
                try {
                    // console.log(testIp);
                    const res = await axios.get(`http://${testIp}:3000/health`, { timeout: 300 });
                    if (res.status === 200) {
                    // console.log("Found backend at:", testIp);
                    backendHost(`http://${testIp}:3000`);
                    return;
                    }
                } catch (err) {
                    // Ignore failed IPs
                }
            }
            console.warn("Backend not found on local network.");
            return null;
        }

        findBackend();
    },[])

    const submitHandle = async () => {
        try {
            if (Loginid === '' || password === '') {
                alert("Please fill in your credentials");
                return;
            }
            console.log(host);
            const response = await axios.post(`${host}/user/auth/login`, {
                Loginid: Loginid,
                Password: password,
            });

            login(response.data.name, response.data.username);
            router.replace("/(tabs)");
        } catch (error) {
            ToastAndroid.show("Login failed", ToastAndroid.SHORT);
            if (axios.isAxiosError(error)) {
                console.log('Login failed:', error.response?.data || error.message);
            } else {
                console.log('Login failed:', error);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Welcome Back</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username or Email"
                    value={Loginid}
                    onChangeText={setLoginid}
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.button} onPress={submitHandle}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.signupLink} onPress={() => router.push('/(auth)/signup')}>
                    Don't have an account? <Text style={styles.signupLinkHighlight}>Sign Up</Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
        justifyContent: 'center',
    },
    innerContainer: {
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 30,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        width: '100%',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    signupLink: {
        marginTop: 20,
        fontSize: 14,
        color: '#555',
    },
    signupLinkHighlight: {
        color: COLORS.primary,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});

export default Login;
