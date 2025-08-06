import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@/Context/UserContext'
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

export default function Profile() {
  
  const { username, logout , host} = useUser();
  const router = useRouter();
  const isFocused = useIsFocused();

  type Bill = {
    _id: string;
    items: { product: any; price: number }[];
    totals: number;
    date: string;
  };
  type userDetails = {
    name: string;
    username: string;
    email: string;
    address: string;
    phone: string;
    profile: string;
    bills: Bill[];
  }
  const [userData, setUserData] = useState<userDetails | null>(null);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(`${host}/user/auth/details`, { username });
        setUserData(response.data.user);
      } catch (error) {
        console.log('Fetch user details error:', error);
      }
    };
    if (username) fetchUserDetails();
  }, [isFocused, username]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {userData ? (
        <>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData.name}</Text>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{userData.username}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email}</Text>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{userData.address}</Text>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{userData.phone}</Text>
          </View>
          <Text style={[styles.title, { fontSize: 22, marginBottom: 12 }]}>Bills</Text>
          {userData.bills.length === 0 ? (
            <Text style={styles.label}>No bills found.</Text>
          ) : (
            userData.bills.map((bill) => (
              <View key={bill._id} style={styles.billBox}>
                <Text style={styles.label}>Bill Date: <Text style={styles.value}>{new Date(bill.date).toLocaleString()}</Text></Text>
                <Text style={styles.label}>Total: <Text style={styles.value}>₹{bill.totals}</Text></Text>
                <Text style={styles.label}>Items:</Text>
                {bill.items.map((item, idx) => (
                  <Text key={idx} style={styles.value}>
                    {item.product?.name || 'Product'} - ₹{item.price}
                  </Text>
                ))}
              </View>
            ))
          )}
        </>
      ) : (
        <Text style={styles.label}>Loading...</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F6F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  billBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 18,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 24,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});