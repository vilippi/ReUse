import { formatBRL } from "@/utils/currency";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
    title: string;
    price: number;
    installments?: number;
};

export default function PriceBlock({ title, price, installments }: Props) {
    const installmentText = (() => {
        const n = installments ?? 1;
        if (n <= 1) return "à vista";
        const parcela = price / n;
        return `${n}x de ${formatBRL(parcela)} sem juros`;
    })();

    return (
        <View style={styles.block}>
            <Text style={styles.productTitle}>{title}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>{formatBRL(price)}</Text>
                <Text style={styles.installments}>{installmentText}</Text>
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
    productTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
    priceRow: { gap: 4 },
    price: { fontSize: 24, fontWeight: "800", color: "#111827" },
    installments: { fontSize: 14, color: "#065f46", fontWeight: "600" },
});
