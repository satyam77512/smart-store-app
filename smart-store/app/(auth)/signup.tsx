import React, { useState,useEffect} from 'react';
import axios from 'axios';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/Context/UserContext';
import { COLORS } from '@/constants/theme';
import * as Network from 'expo-network';


const Signup = () => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const {isLoggedIn,login ,backendHost,host} = useUser();


    useEffect(() => {
        if (isLoggedIn) {
            router.replace('/(tabs)');
        }
        const findBackend = async ()=>{
            var deviceIp = await Network.getIpAddressAsync();
            const subnet = deviceIp.split('.').slice(0, 3).join('.'); // "192.168.29"

            for (let i = 1; i < 255; i++) {
                const testIp = `${subnet}.${i}`;
                try {
                    // console.log(testIp);
                    const res = await axios.get(`http://${testIp}:3000/health`, { timeout: 300 });
                    if (res.status === 200) {
                    // console.log("Found backend at:", testIp);
                    backendHost(`http://${testIp}:3000`);
                    }
                } catch (err) {
                    // Ignore failed IPs
                }

            }
            console.warn("Backend not found on local network.");
            return null;
        }

        findBackend();
    }, [isLoggedIn]);

    const submitHandle = async () => {
        if (!name || !username || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post(`${host}/user/auth/signup`, {
                name,
                username,
                email,
                password,
            });

            ToastAndroid.show("Signup successful!", ToastAndroid.SHORT);

            // Auto-login after signup
            login(response.data.name, response.data.username);
            router.replace('/(tabs)');
        } catch (error) {
            ToastAndroid.show("Signup failed", ToastAndroid.SHORT);
            if (axios.isAxiosError(error)) {
                console.log('Signup error:', error.response?.data || error.message);
            } else {
                console.log('Signup error:', error);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Create Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.button} onPress={submitHandle}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.linkText}>
                        Already have an account? <Text style={styles.linkHighlight}>Login</Text>
                    </Text>
                </TouchableOpacity>
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
    linkText: {
        marginTop: 20,
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    linkHighlight: {
        color: COLORS.primary,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default Signup;
