import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
    onPress?: () => void;
};

export default function QuickCard({ icon, label, value, onPress }: Props) {
    return (
        <Pressable style={styles.card} onPress={onPress} android_ripple={{ color: "#00000010" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {icon}
                <Text style={styles.cardLabel}>{label}</Text>
            </View>
            {value !== undefined ? <Text style={styles.cardValue}>{value}</Text> : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        justifyContent: "space-between",
    },
    cardLabel: { fontSize: 13, color: "#334155" },
    cardValue: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
});
