import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Pressable,
    ScrollView,
    Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { MOCK_PERFIL } from "./_mock";
import ProfileCard from "@/components/perfil/ProfileCard";
import QuickCard from "@/components/perfil/QuickCard";
import ListItem from "@/components/perfil/ListItem";
import { Link } from "expo-router";

export default function Perfil() {
    const [notifPush, setNotifPush] = useState(true);

    const go = (route: string) => {
        console.log("Abrir rota:", route);
    };

    const { name, emailMasked, avatar, stats } = MOCK_PERFIL;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }} edges={["top", "left", "right"]}>
            {Platform.OS === "android" ? (
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            ) : null}

            {/* Cabeçalho simples */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Minha conta</Text>
                <Pressable style={styles.headerIcon} onPress={() => go("Config")}>
                    <Ionicons name="settings-outline" size={22} color="#111827" />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {/* Card do perfil */}
                <ProfileCard
                    name={name}
                    emailMasked={emailMasked}
                    avatar={avatar}
                    onEdit={() => go("EditarPerfil")}
                    onSecurity={() => go("Seguranca")}
                />

                {/* Resumo + Cards rápidos (exatos) */}
                <Text style={styles.sectionTitle}>Resumo</Text>
                <View style={styles.cards}>
                    <QuickCard
                        icon={<Ionicons name="bag-handle-outline" size={22} color="#0ea5e9" />}
                        label="Pedidos"
                        value={stats.pedidos}
                        onPress={() => go("Pedidos")}
                    />
                    <QuickCard
                        icon={<Ionicons name="heart-outline" size={22} color="#ef4444" />}
                        label="Favoritos"
                        value={stats.favoritos}
                        onPress={() => go("Favoritos")}
                    />
                    <QuickCard
                        icon={<Ionicons name="wallet-outline" size={22} color="#22c55e" />}
                        label="Cupons"
                        value={stats.cupons}
                        onPress={() => go("Cupons")}
                    />
                </View>

                {/* Conta */}
                <Text style={styles.sectionTitle}>Vendas</Text>
                <View style={{ paddingHorizontal: 16 }}>
                    <Link href="/(tabs)/perfil/vender-produto" asChild>
                        <ListItem
                            icon={<Ionicons name="pricetag-outline" size={20} color="#6b7280" />}
                            label="Vender um produto"
                            hint="Crie seu anúncio"
                            onPress={() => go("VenderProduto")}
                        />
                    </Link>
                </View>

                {/* Preferências */}
                <Text style={styles.sectionTitle}>Preferências</Text>
                <View style={{ paddingHorizontal: 16 }}>
                    <ListItem
                        icon={<Ionicons name="location-outline" size={20} color="#6b7280" />}
                        label="Endereços"
                        hint="Entrega e cobrança"
                        onPress={() => go("Enderecos")}
                    />
                    <ListItem
                        icon={<Ionicons name="card-outline" size={20} color="#6b7280" />}
                        label="Pagamentos"
                        hint="Cartões, PIX"
                        onPress={() => go("Pagamentos")}
                    />
                    <ListItem
                        icon={<Ionicons name="notifications-outline" size={20} color="#6b7280" />}
                        label="Notificações push"
                        right={
                            <Switch
                                value={notifPush}
                                onValueChange={setNotifPush}
                                thumbColor={notifPush ? "#0ea5e9" : undefined}
                            />
                        }
                    />
                </View>

                {/* Ajuda */}
                <Text style={styles.sectionTitle}>Ajuda</Text>
                <View style={{ paddingHorizontal: 16 }}>
                    <Link href="/(tabs)/perfil/ajuda" asChild>
                        <ListItem
                            icon={<Ionicons name="help-circle-outline" size={20} color="#6b7280" />}
                            label="Central de ajuda"
                            onPress={() => go("Ajuda")}
                        />
                    </Link>
                </View>

                {/* Conta */}
                <Text style={styles.sectionTitle}>Conta</Text>
                <View style={{ paddingHorizontal: 16 }}>
                    <ListItem
                        icon={<Ionicons name="document-text-outline" size={20} color="#6b7280" />}
                        label="Termos e privacidade"
                        onPress={() => go("Termos")}
                    />
                    <ListItem
                        icon={<Ionicons name="log-out-outline" size={20} color="#ef4444" />}
                        label="Sair"
                        labelStyle={{ color: "#ef4444" }}
                        onPress={() => console.log("Sair")}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ---------- Styles locais da página ---------- */

const styles = StyleSheet.create({
    // Header
    header: {
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
    },
    headerIcon: {
        padding: 6,
        borderRadius: 999,
    },

    // Títulos de seção (mesmo padrão da Home)
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        paddingHorizontal: 16,
        marginTop: 18,
        marginBottom: 10,
    },

    // Linha dos cards rápidos (estilo exato)
    cards: { flexDirection: "row", gap: 10, marginVertical: 12, paddingHorizontal: 16 },
});
