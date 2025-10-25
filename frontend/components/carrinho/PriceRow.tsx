import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    label: string;
    value: string;
    strong?: boolean;
};

export default function PriceRow({ label, value, strong }: Props) {
    return (
        <View style={styles.row}>
            <Text style={[styles.label, strong && styles.labelStrong]}>{label}</Text>
            <Text style={[styles.value, strong && styles.valueStrong]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    label: { fontSize: 14, color: "#374151" },
    value: { fontSize: 14, color: "#111827" },
    labelStrong: { fontWeight: "700", color: "#111827" },
    valueStrong: { fontWeight: "700", color: "#111827", fontSize: 16 },
});
