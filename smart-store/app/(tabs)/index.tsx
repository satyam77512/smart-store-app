import { Text, View, ScrollView, Image, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/Context/UserContext";
import React, { useEffect} from 'react';
import * as Network from 'expo-network';
import axios from "axios";

const images = [
  "https://imgs.search.brave.com/-6Cxu0CnvUgknXROyTBKFwFtmN9-XczkfItHHUJQdQs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1wc2QvZmFz/aGlvbi1zYWxlLXBv/c3Rlci10ZW1wbGF0/ZV8yMy0yMTQ4NjMz/ODcwLmpwZz9zZW10/PWFpc19oeWJyaWQm/dz03NDA",
  "https://imgs.search.brave.com/U08GNOPQXXJsMJ5j93vU8N1APvbnRuFSlv77RJKzSaw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU0/MjYxNDg2NS9waG90/by9tYW4tc2hvcHBp/bmctdmVnZXRhYmxl/cy1pbi1ncm9jZXJp/ZXMtc3RvcmUuanBn/P2I9MSZzPTYxMng2/MTImdz0wJms9MjAm/Yz1wdFR2UjgxN2Rw/MkYwVkxoaFdGeVFQ/V05TQnFlNHlPaHlF/QjBvbjdTNDV3PQ",
  "https://imgs.search.brave.com/9CoT3ObxNSQSbD-g2Q3HPuLsWjmMqC37aFy8Du16UKM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzgv/NzA3LzczNi9zbWFs/bC9haS1nZW5lcmF0/ZWQtc25hY2tzLWlu/LWEtY29udGFpbmVy/LXByb2Zlc3Npb25h/bC1hZHZlcnRpc2lu/Zy1mb29kZ3JhcGh5/LXBob3RvLmpwZw",
  "https://imgs.search.brave.com/wTGLkUJAtwwRqU0JGalLKn2elDmg2zRWtyrxNpILVLU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzQzLzIxLzE1/LzM2MF9GXzU0MzIx/MTU4M180TkpaOUEw/NjJzTnM0dnRsQTFw/QTA5b1lMMlNiR1dF/VS5qcGc"
];

const bestDeals = [
  {
    id: "deal1",
    title: "50% Off on Cold Drinks",
    image: "https://imgs.search.brave.com/2Wg4jMr8EXgubymGwfYyKndReycg17ffu2ZuJddfnkw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvYXNz/b3J0ZWQtY29sZC1k/cmlua3MtY29sbGVj/dGlvbi0zbWdqaTJp/MHV5Y3Joem5pLnBu/Zw",
    store: "SuperMart",
    price: "₹20",
  },
  {
    id: "deal2",
    title: "Buy 1 Get 1 Free Biscuits",
    image: "https://imgs.search.brave.com/jZtn3lbV6uW-FJMb9_Lkl5LV22Q4n2Mn6MFTgSoNslk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDIwLzEx/L0FBL0dRL0ZWLzc3/NzU4MjA5L2JyaXRh/bm5pYS01MDB4NTAw/LmpwZw",
    store: "Grocery Hub",
    price: "₹40",
  },
  {
    id: "deal3",
    title: "Fresh Apples Discount",
    image: "https://imgs.search.brave.com/Y0RcG3wisoU22T1x6dl3PsitEcUwhmOiqedDO1Vx0qs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4x/MS5iaWdjb21tZXJj/ZS5jb20vcy1jYzR2/d2lrenNtL2ltYWdl/cy9zdGVuY2lsLzUw/MHg1MDAvcHJvZHVj/dHMvMTU5Ni8yNDQ4/ODAvZnVsbF9fNjUz/OTkuMTcyNDg5MDUz/MC5qcGc_Yz0x",
    store: "Fruit World",
    price: "₹60",
  },
];
const recommendations = [
  {
    id: "rec1",
    title: "Try Our New Organic Honey",
    image: "https://imgs.search.brave.com/UvGoFFK_uHHzl0k8k_zZK8H1kaSGNq-MzGZScF5SJxI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2JhL2Jl/LzVhL2JhYmU1YTY0/ZTRiODI3YjQ2MjMx/OGU2NzA0OWMzNDc5/LmpwZw",
    price: "₹120",
  },
  {
    id: "rec2",
    title: "Fresh Almonds Pack",
    image: "https://imgs.search.brave.com/ztwsOGldjjqQmguufWS7ULd7BtOKg5viLhlpAt-Ya7Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzM0LzMxLzc0/LzM2MF9GXzkzNDMx/NzQ3OV83NG9KRnI4/UVUzbWNweXlEQmRz/NHEyZnZYQU5vWUFk/Yi5qcGc",
    price: "₹200",
  },
];

export default function Index() {

  const router = useRouter();

  const {name,backendHost,host} = useUser();

useEffect(() => {

  const findBackend = async () => {
    if(host) return;

    const deviceIp = await Network.getIpAddressAsync();
    const subnet = deviceIp.split('.').slice(0, 3).join('.');

    for (let i = 1; i < 255; i++) {
      const testIp = `${subnet}.${i}`;
      try {
        const res = await axios.get(`http://${testIp}:3000/health`, { timeout: 300 });
        if (res.status === 200) {
          backendHost(`http://${testIp}:3000`);
          break;
        }
      } catch (err) {
        // skip
      }
    }
    console.warn("Backend not found on local network.");
  };

  findBackend();
}, [host]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.tile}>Hello {name.trim().split(" ")[0]}</Text>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 24 }}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 8 }}
        >
          {images.map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>🔥 Best Deals in Stores</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 8 }}
        >
          {bestDeals.map((deal) => (
            <View key={deal.id} style={styles.dealCard}>
              <Image
                source={{ uri: deal.image }}
                style={styles.dealImage}
                resizeMode="cover"
              />
              <Text style={styles.dealTitle}>{deal.title}</Text>
              <Text style={styles.dealStore}>{deal.store}</Text>
              <Text style={styles.dealPrice}>{deal.price}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>✨ Recommendations for You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 8 }}
        >
          {recommendations.map((rec) => (
            <View key={rec.id} style={styles.dealCard}>
              <Image
                source={{ uri: rec.image }}
                style={styles.dealImage}
                resizeMode="cover"
              />
              <Text style={styles.dealTitle}>{rec.title}</Text>
              <Text style={styles.dealPrice}>{rec.price}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F4F6F8",
    paddingBottom: 16,
  },
  tile: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 24,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 130,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9500",
    marginTop: 32,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  dealCard: {
    width: 180,
    backgroundColor: "#DDF6D2",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  dealImage: {
    width: 160,
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  dealTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
    textAlign: "center",
  },
  dealStore: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
    textAlign: "center",
  },
  dealPrice: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
    marginTop: 2,
    textAlign: "center",
  },
});