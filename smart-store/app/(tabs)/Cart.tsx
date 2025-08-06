import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useUser } from "@/Context/UserContext";
import { useIsFocused } from '@react-navigation/native';



const Cart = () => {

  const { isLoggedIn, username, host} = useUser();
  const router = useRouter();
  const isFocused = useIsFocused();

  type CartItem = {
    _id: string;
    name: string;
    price: number;
    productDetails: string;
    productId: string;
  };
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paid,setPaid] = useState(false);
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.post(`${host}/user/product/fetchCart`, {
          username,
        });
        setCart(response.data.cart);
        
      } catch (error) {
        ToastAndroid.show("Server error", ToastAndroid.SHORT);
        if (axios.isAxiosError(error)) {
          console.log('Fetch error:', error.response?.data || error.message);
        } else {
          console.log('Fetch error:', error);
        }
      }
    };

    fetchCart();
  }, [isFocused, isLoggedIn, username, paid]);

  const removeHandler = async (productId: string) => {
    try {
      await axios.post(`${host}/user/product/removeItem`, {
        username,
        productId,
      });
      setCart(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      ToastAndroid.show("Server error", ToastAndroid.SHORT);
    }
  };



  const paymentHandler = async () => {
    try {
      await axios.post(`${host}/user/pay/payment`, {
        username
      });
      setPaid(true);
      ToastAndroid.show("Done!", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Server error", ToastAndroid.SHORT);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🛒 Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.cartList}>
          {cart.length>0 && cart.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeHandler(item.productId)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹ {item.price.toFixed(2)}</Text>
              <Text style={styles.productDetails}>{item.productDetails}</Text>
              <Text style={styles.productId}>ID: {item.productId}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      {cart.length>0 ? (
        <TouchableOpacity style={styles.payButton} onPress={paymentHandler}>
          <Text style={styles.payButtonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.paymentSuccessContainer}>
          <Text style={styles.paymentSuccessText}>✅ Payment Successful!</Text>
          <Image source={{uri:"https://imgs.search.brave.com/ZYQOQJ2--dpBplr9B4cliwHyRb_G_XBiks4SlXhof6c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE1LzQ1LzQyLzE3/LzM2MF9GXzE1NDU0/MjE3ODZfZmc0Nk5L/TmtoTTh3OVQ4aHN5/dDVMUTNsVlpDTmtN/WVMuanBn"}}
          style={{width:120,height:120,marginTop:16}}
          resizeMode='contain'
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  cartList: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 6,
    fontWeight: '500',
  },
  productDetails: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  productId: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  paymentSuccessContainer: {
  position: 'absolute',
  top: 150,
  left: 0,
  right: 0,
  zIndex: 100,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 16,
  backgroundColor: '#e6ffe6',
  borderBottomWidth: 1,
  borderBottomColor: '#28a745',
  shadowColor: '#28a745',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
},
paymentSuccessText: {
  color: '#28a745',
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
},
});

export default Cart;
