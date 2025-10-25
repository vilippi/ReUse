import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    name: string;
    emailMasked: string;
    avatar: string;
    onEdit?: () => void;
    onSecurity?: () => void;
};

export default function ProfileCard({ name, emailMasked, avatar, onEdit, onSecurity }: Props) {
    return (
        <View style={styles.profileCard}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ position: "relative" }}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <Pressable style={styles.avatarEdit} onPress={() => console.log("Trocar foto")}>
                        <Ionicons name="camera" size={14} color="#fff" />
                    </Pressable>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.meta}>{emailMasked}</Text>

                    <View style={styles.actionsRow}>
                        <Pressable style={styles.actionBtn} onPress={onEdit} android_ripple={{ color: "#00000010" }}>
                            <Ionicons name="create-outline" size={18} color="#0ea5e9" />
                            <Text style={styles.actionText}>Editar perfil</Text>
                        </Pressable>
                        <Pressable style={styles.actionBtn} onPress={onSecurity} android_ripple={{ color: "#00000010" }}>
                            <MaterialCommunityIcons name="shield-outline" size={18} color="#0ea5e9" />
                            <Text style={styles.actionText}>Segurança</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        marginHorizontal: 16,
        marginTop: 10,
        padding: 14,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    avatar: { width: 64, height: 64, borderRadius: 999 },
    avatarEdit: {
        position: "absolute",
        right: -4,
        bottom: -2,
        width: 24,
        height: 24,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0ea5e9",
    },
    name: { fontSize: 18, fontWeight: "700", color: "#111827" },
    meta: { fontSize: 13, color: "#6b7280", marginTop: 2 },
    actionsRow: { flexDirection: "row", gap: 10, marginTop: 10 },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#e0f2fe",
    },
    actionText: { color: "#0369a1", fontSize: 13, fontWeight: "600" },
});
