import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useUser } from "@/Context/UserContext";
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';



const QRScanner = () => {
  
  const { isLoggedIn, username ,host} = useUser();
  const router = useRouter();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState('');
  const [product, setProduct] = useState({
    ProductName: '',
    Price: '',
    Details: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need access to your camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = async (result: { data: string; type: string }) => {
    if (!scanned) {
      setScanned(true);
      const scannedCode = result.data || "No data";

      if (scannedCode === "No data") {
        setScanned(false);
        return;
      }

      try {
        const response = await axios.post(`${host}/user/product/fetchProduct`, {
          username,
          productId: scannedCode,
        });

        setProduct({
          ProductName: response.data.name || "N/A",
          Price: response.data.price?.toString() || "N/A",
          Details: response.data.productDetails || "N/A",
        });
        setCode(response.data.productId);
      } catch (err) {
        ToastAndroid.show("Failed to fetch product", ToastAndroid.SHORT);
        setScanned(false);
      }
    }
  };

  const buyProductHandler = async () => {
    try {
      await axios.post(`${host}/user/product/buyProduct`, {
        username,
        productId: code,
      });

      ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
      resetScanner();
    } catch (err) {
      ToastAndroid.show("Server error", ToastAndroid.SHORT);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setProduct({ ProductName: '', Price: '', Details: '' });
    setCode('');
  };

  return isFocused && !scanned ? (
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
          <Text style={styles.scanText}>Align the QR code within the box</Text>
          <View style={styles.scanBox} />
        </View>
      </CameraView>
    </View>
  ) : (
    <View style={styles.productContainer}>
      <Text style={styles.productTitle}>📦 Product Details</Text>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{product.ProductName || "N/A"}</Text>
        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>₹{product.Price || "N/A"}</Text>
        <Text style={styles.label}>Details</Text>
        <Text style={styles.value}>{product.Details || "N/A"}</Text>
      </View>

      <TouchableOpacity style={styles.buyButton} onPress={buyProductHandler}>
        <Text style={styles.buyButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.laterButton} onPress={resetScanner}>
        <Text style={styles.laterButtonText}>Scan Another</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBox: {
    width: width * 0.65,
    height: width * 0.65,
    borderColor: "#00FFAA",
    borderWidth: 3,
    borderRadius: 16,
    marginTop: 12,
  },
  scanText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fefefe",
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  productContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F4F6F8",
    alignItems: "center",
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  detailCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: "#222",
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 12,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  laterButton: {
    backgroundColor: "#FFDD57",
    paddingVertical: 14,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  laterButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QRScanner;
