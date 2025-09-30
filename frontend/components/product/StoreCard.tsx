import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Store } from "@/types/product";

type Props = { store: Store };

export default function StoreCard({ store }: Props) {
    return (
        <View style={styles.storeCard}>
            <View style={styles.storeAvatar}>
                <Ionicons name="storefront-outline" size={22} />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.storeName}>{store.name}</Text>
                <View style={styles.storeMeta}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.storeMetaText}>
                        {store.rating.toFixed(1)} • {store.sales.toLocaleString("pt-BR")} vendas
                    </Text>
                </View>
            </View>

            <Link href={`/loja/${store.id}`} asChild>
                <Pressable style={styles.storeButton}>
                    <Text style={styles.storeButtonText}>Ver loja</Text>
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    storeCard: {
        margin: 16,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        elevation: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    storeAvatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
    },
    storeName: { fontSize: 16, fontWeight: "700", color: "#111827" },
    storeMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
    storeMetaText: { color: "#4b5563", fontSize: 12 },
    storeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#eef2ff",
    },
    storeButtonText: { color: "#3730a3", fontWeight: "600" },
});
