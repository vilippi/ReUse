import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { shadowSm } from "@/utils/shadow";

type Props = {
    unreadCount: number;
    onPress?: () => void;
};

export default function NotificationButton({ unreadCount, onPress }: Props) {
    const isAlert = unreadCount > 0;

    return (
        <Pressable onPress={onPress} style={[styles.iconBtn, { borderColor: isAlert ? "#ef4444" : "#e5e7eb" }]}>
            <Ionicons
                name={isAlert ? "notifications" : "notifications-outline"}
                size={22}
                color={isAlert ? "#ef4444" : "#374151"}
            />
            {isAlert && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : String(unreadCount)}</Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    iconBtn: {
        width: 44,
        height: 44,
        borderWidth: 2,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        ...shadowSm(),
    },
    badge: {
        position: "absolute",
        top: -4,
        right: -4,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#ef4444",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: "#fff",
    },
    badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
