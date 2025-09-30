// @/components/home/Header.tsx
import React, { useState, useCallback } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { shadowSm } from "@/utils/shadow";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationButton from "./notifications/NotificationButton";
import NotificationsPopover from "./notifications/NotificationsPopover";
import { Href, useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();
  const { notificacoes, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
    
    markAllAsRead();
  }, [markAllAsRead]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleVerTudo = useCallback(() => {
    setOpen(false);
    router.push("/notificacoes" as Href);
  }, [router]);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#6b7280" />
          <TextInput
            placeholder="Buscar no Marketplace"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            returnKeyType="search"
          />
        </View>

        <NotificationButton unreadCount={unreadCount} onPress={handleOpen} />
      </View>

      <NotificationsPopover
        visible={open}
        onClose={handleClose}
        notificacoes={notificacoes}
        onPressVerTudo={handleVerTudo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: "#f3f4f6" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f3f4f6",
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    ...shadowSm(),
  },
  input: { flex: 1, fontSize: 15, color: "#111827" },
});
