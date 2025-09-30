import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
    qty: number;
    stock: number;
    onInc: () => void;
    onDec: () => void;
};

export default function QuantitySelector({ qty, stock, onInc, onDec }: Props) {
    return (
        <View style={styles.block}>
            <Text style={styles.sectionTitle}>Quantidade</Text>
            <View style={styles.qtyRow}>
                <Pressable onPress={onDec} style={[styles.qtyBtn, qty === 1 && styles.qtyBtnDisabled]}>
                    <Ionicons name="remove" size={20} />
                </Pressable>
                <Text style={styles.qtyValue}>{qty}</Text>
                <Pressable onPress={onInc} style={[styles.qtyBtn, qty >= stock && styles.qtyBtnDisabled]}>
                    <Ionicons name="add" size={20} />
                </Pressable>
                <Text style={styles.stockText}>({stock} disponíveis)</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#fff",
        gap: 10,
        elevation: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
    qtyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    qtyBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
    },
    qtyBtnDisabled: { opacity: 0.5 },
    qtyValue: { minWidth: 28, textAlign: "center", fontSize: 16, fontWeight: "700" },
    stockText: { color: "#6b7280" },
});
