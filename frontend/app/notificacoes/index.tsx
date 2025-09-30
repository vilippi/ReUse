// app/notificacoes/index.tsx
import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotificationsStore } from "@/context/NotificationsContext";

export default function NotificacoesPage() {
    const { notificacoes, markAllAsRead, unreadCount } = useNotificationsStore();

    const data = useMemo(
        () => [...notificacoes].sort((a, b) => Number(a.lida) - Number(b.lida)),
        [notificacoes]
    );

    return (
        <SafeAreaView style={styles.screen} edges={["top"]}>
            <View style={styles.pageHeader}>
                <Text style={styles.title}>Notificações</Text>
                {unreadCount > 0 && (
                    <Pressable onPress={markAllAsRead} style={styles.actionBtn}>
                        <Ionicons name="checkmark-done-outline" size={18} color="#2563eb" />
                        <Text style={styles.actionText}>Marcar todas como lidas</Text>
                    </Pressable>
                )}
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={{ paddingBottom: 24 }}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.iconWrap}>
                            <Ionicons name="alert-circle-outline" size={20} color="#111827" />
                            {!item.lida && <View style={styles.unreadDot} />}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.itemTitle, item.lida && styles.itemTitleRead]} numberOfLines={1}>
                                {item.titulo}
                            </Text>
                            {!!item.descricao && (
                                <Text style={[styles.itemDesc, item.lida && styles.itemDescRead]} numberOfLines={2}>
                                    {item.descricao}
                                </Text>
                            )}
                            {!!item.data && <Text style={styles.itemTime}>{item.data}</Text>}
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="notifications-off-outline" size={28} color="#9ca3af" />
                        <Text style={styles.emptyText}>Você não tem notificações</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f3f4f6", paddingHorizontal: 16 },
    pageHeader: {
        paddingVertical: 8,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    title: { fontSize: 20, fontWeight: "800", color: "#111827", flex: 1 },
    actionBtn: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#eff6ff",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    actionText: { color: "#2563eb", fontSize: 13, fontWeight: "700" },
    separator: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 10 },
    item: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    iconWrap: { width: 28, alignItems: "center" },
    unreadDot: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: "#ef4444",
        position: "absolute", right: 0, top: -2,
    },
    itemTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
    itemTitleRead: { color: "#374151", fontWeight: "700" },
    itemDesc: { fontSize: 13, color: "#4b5563", marginTop: 2 },
    itemDescRead: { color: "#6b7280" },
    itemTime: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
    empty: { alignItems: "center", gap: 8, padding: 24 },
    emptyText: { color: "#6b7280", fontSize: 14 },
});
