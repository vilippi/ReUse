import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    icon?: React.ReactNode;
    label: string;
    hint?: string;
    right?: React.ReactNode;
    onPress?: () => void;
    labelStyle?: any;
};

export default function ListItem({ icon, label, hint, right, onPress, labelStyle }: Props) {
    return (
        <Pressable onPress={onPress} style={styles.listItem}>
            <View style={styles.itemLeft}>
                {icon && <View style={styles.itemIcon}>{icon}</View>}
                <View style={{ flex: 1 }}>
                    <Text style={[styles.itemLabel, labelStyle]}>{label}</Text>
                    {hint ? <Text style={styles.itemHint}>{hint}</Text> : null}
                </View>
            </View>
            <View style={styles.itemRight}>
                {right ?? <Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    listItem: {
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    itemLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
    itemIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#f3f4f6",
        alignItems: "center",
        justifyContent: "center",
    },
    itemLabel: { fontSize: 15, fontWeight: "600", color: "#111827" },
    itemHint: { fontSize: 12, color: "#6b7280", marginTop: 2 },
    itemRight: { marginLeft: 8 },
});
