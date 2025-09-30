import React from "react";
import { Modal, Pressable, StyleSheet, View, Text, FlatList, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { Notificacao } from "@/types/notification";
import { shadowSm } from "@/utils/shadow";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
    visible: boolean;
    onClose: () => void;
    notificacoes: Notificacao[];
    onPressVerTudo: () => void;
};

export default function NotificationsPopover({ visible, onClose, notificacoes, onPressVerTudo }: Props) {
    const insets = useSafeAreaInsets();
    const POPOVER_TOP = (Platform.OS === "ios" ? 8 : 8) + insets.top + 44 + 12;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />

            <View style={[styles.popover, { top: POPOVER_TOP }]}>
                <Text style={styles.title}>Notificações</Text>

                <FlatList
                    data={notificacoes.slice(0, 3)}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Ionicons name="alert-circle-outline" size={18} color="#111827" style={{ marginTop: 2 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemTitle} numberOfLines={1}>{item.titulo}</Text>
                                {!!item.descricao && <Text style={styles.itemDesc} numberOfLines={1}>{item.descricao}</Text>}
                                {!!item.data && <Text style={styles.itemTime}>{item.data}</Text>}
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>Nenhuma notificação</Text>}
                />

                <Pressable onPress={onPressVerTudo} style={styles.verTudoBtn}>
                    <Text style={styles.verTudoText}>Ver tudo</Text>
                    <Ionicons name="chevron-forward" size={18} color="#2563eb" />
                </Pressable>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.1)" },
    popover: {
        position: "absolute",
        right: 16,
        width: 320,
        maxWidth: "90%",
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 12,
        ...shadowSm(),
    },
    title: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
    separator: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 },
    item: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
    itemTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
    itemDesc: { fontSize: 13, color: "#4b5563", marginTop: 2 },
    itemTime: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
    empty: { textAlign: "center", padding: 12, color: "#6b7280" },
    verTudoBtn: {
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#eff6ff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    verTudoText: { color: "#2563eb", fontSize: 14, fontWeight: "700" },
});
