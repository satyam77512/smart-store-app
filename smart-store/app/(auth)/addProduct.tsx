import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useUser } from "@/Context/UserContext";
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';

const host = "http://192.168.29.158:3000"

const Addproduct = () => {

    const { isLoggedIn, username } = useUser();

    const router = useRouter();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isLoggedIn) {
            router.replace('/(auth)/login');
        }
    }, [isLoggedIn]);

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [details, setDetails] = useState('');
    const [code, setCode] = useState('');


    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to access the camera</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    const handleScan = async (result: { data: string; type: string }) => {
        if (!scanned) {
            setScanned(true);
            setCode(result.data || "No data");
            if (code === "No data") {
                setScanned(false);
            }
        }
    };

    const handleProductSubmit = async () => {
        try {
            const response = await axios.post(`${host}/user/product/addProduct`, {
                productId: code,
                name: name,
                price: price,
                productDetails: details
            });
            ToastAndroid.show("Product saved!", ToastAndroid.SHORT);
            // Reset form fields after successful save
            setName('');
            setPrice('');
            setDetails('');
            setCode('');
            setScanned(false); // Show scanner again
        } catch (error) {
            ToastAndroid.show("server error", ToastAndroid.SHORT);
            if (axios.isAxiosError(error)) {
                console.log('Login failed:', error.response?.data || error.message);
            } else {
                console.log('Login failed:', error);
            }
        }
        setScanned(false);
    }

    return (
       (isFocused && !scanned) ? (
            // Show Camera
            <View style={styles.container}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code128"],
                    }}
                    onBarcodeScanned={handleScan}
                >
                    <View style={styles.overlay}>
                        <View style={styles.scanArea} />
                    </View>
                </CameraView>
            </View>
        ) : (
            // Product Details Input Form
            <View style={styles.formContainer}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter product name"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter price"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />

                <Text style={styles.label}>Product Details</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter product details"
                    multiline
                    numberOfLines={4}
                    value={details}
                    onChangeText={setDetails}
                />

                <TouchableOpacity onPress={handleProductSubmit} style={styles.submitButton}>
                    <Text style={styles.buttonText}>Save Product</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setScanned(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )


    )
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    message: { textAlign: "center", marginTop: 20 },
    camera: { flex: 1 },
    buttonContainer: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
    },
    button: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 10,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },

    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },

    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },

    submitButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    
});

export default Addproduct;