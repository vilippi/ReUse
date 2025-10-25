import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { CartProduct } from "@/app/(tabs)/carrinho/_mock";

type Props = {
    item: CartProduct;
    onInc: (id: string) => void;
    onDec: (id: string) => void;
    onRemove: (id: string) => void;
    currency: (n: number) => string;
};

export default function CartItem({ item, onInc, onDec, onRemove, currency }: Props) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                {!!item.variant && <Text style={styles.variant}>{item.variant}</Text>}

                <View style={styles.row}>
                    <Text style={styles.price}>{currency(item.price)}</Text>

                    <View style={styles.qtyWrap}>
                        <Pressable style={styles.qtyBtn} onPress={() => onDec(item.id)}>
                            <Ionicons name="remove" size={16} color="#111827" />
                        </Pressable>
                        <Text style={styles.qty}>{item.qty}</Text>
                        <Pressable style={styles.qtyBtn} onPress={() => onInc(item.id)}>
                            <Ionicons name="add" size={16} color="#111827" />
                        </Pressable>
                    </View>
                </View>
            </View>

            <Pressable style={styles.remove} onPress={() => onRemove(item.id)}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        alignItems: "center",
    },
    image: { width: 64, height: 64, borderRadius: 8, backgroundColor: "#f3f4f6" },
    title: { fontSize: 15, fontWeight: "600", color: "#111827" },
    variant: { fontSize: 12, color: "#6b7280", marginTop: 2 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
    price: { fontSize: 16, fontWeight: "700", color: "#111827" },
    qtyWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
    qtyBtn: {
        width: 28, height: 28, borderRadius: 8,
        borderWidth: 1, borderColor: "#e5e7eb",
        alignItems: "center", justifyContent: "center", backgroundColor: "#fff",
    },
    qty: { minWidth: 18, textAlign: "center", fontSize: 14, color: "#111827" },
    remove: { padding: 8, marginLeft: 6 },
});
