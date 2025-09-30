import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Platform, Text, StyleSheet } from "react-native";
import Header from "@/components/home/Header";
import ProductGrid from "@/components/home/ProductGrid";
import { MOCK } from "./_mock";
import { shadowSm } from "@/utils/shadow";
import CategoryCarousel from "@/components/home/CategoryCarousel";

export default function Home() {
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: "#f3f4f6" }} 
      edges={["top", "left", "right"]}
    >
      {Platform.OS === "android" ? ( 
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      ) : null}

      <Header />

      <CategoryCarousel />

      <Text style={styles.sectionTitle}>Ofertas para você</Text>

      <ProductGrid data={MOCK} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  
  cardWithShadow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    ...shadowSm(),
  },
});
