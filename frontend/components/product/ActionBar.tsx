import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
    onAddToCart: () => void;
    onBuyNow: () => void;
};

export default function ActionBar({ onAddToCart, onBuyNow }: Props) {
    return (
        <View style={styles.actionBar}>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable onPress={onAddToCart} style={[styles.cta, styles.ctaSecondary]}>
                    <Ionicons name="cart-outline" size={18} color="#111827" />
                    <Text style={styles.ctaSecondaryText}>Carrinho</Text>
                </Pressable>

                <Pressable onPress={onBuyNow} style={[styles.cta, styles.ctaPrimary]}>
                    <Text style={styles.ctaPrimaryText}>Comprar agora</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    actionBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 8,
        height: 70,
        backgroundColor: "rgba(255,255,255,0.98)",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    cta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 12,
        flex: 1,
    },
    ctaSecondary: { backgroundColor: "#e5e7eb" },
    ctaSecondaryText: { color: "#111827", fontWeight: "800" },
    ctaPrimary: { backgroundColor: "#16a34a" },
    ctaPrimaryText: { color: "#fff", fontWeight: "800" },
});
