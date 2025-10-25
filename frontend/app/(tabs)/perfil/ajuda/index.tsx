// app/(tabs)/perfil/ajuda/index.tsx
import React, { useState } from "react";
import {
    Platform,
    UIManager,
    LayoutAnimation,
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    Linking,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { faqs, type FAQ } from "./_mock";

// Habilita animação no Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function AccordionItem({ item }: { item: FAQ }) {
    const [open, setOpen] = useState(false);
    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpen((v) => !v);
    };

    return (
        <View style={styles.card}>
            <Pressable onPress={toggle} style={styles.row} accessibilityRole="button">
                <View style={styles.iconWrap}>
                    <Ionicons name="help-circle-outline" size={20} color="#0ea5e9" />
                </View>
                <Text style={styles.question}>{item.pergunta}</Text>
                <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color="#374151" />
            </Pressable>

            {open && (
                <View style={styles.answerBox}>
                    {typeof item.resposta === "string" ? (
                        <Text style={styles.answer}>{item.resposta}</Text>
                    ) : (
                        item.resposta
                    )}
                </View>
            )}
        </View>
    );
}

function SupportSection() {
    const email = "suporte@reuse.com";
    const whatsapp = "+55 11 96333-6904";

    return (
        <View style={[styles.card, { marginTop: 12 }]}>
            <View style={[styles.row, { marginBottom: 8 }]}>
                <MaterialCommunityIcons name="lifebuoy" size={20} color="#0ea5e9" />
                <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Suporte e Contato</Text>
            </View>

            <Text style={styles.supportText}>Seg–sex, 09h às 18h (BRT)</Text>

            <View style={styles.actionsRow}>
                <Pressable
                    style={styles.supportBtn}
                    onPress={() =>
                        Linking.openURL(
                            `mailto:${email}?subject=${encodeURIComponent("Suporte | Central de Ajuda")}`
                        )
                    }
                >
                    <Ionicons name="mail-outline" size={18} color="#0ea5e9" />
                    <Text style={styles.supportBtnText}>E-mail</Text>
                </Pressable>

                <Pressable
                    style={styles.supportBtn}
                    onPress={() =>
                        Linking.openURL(
                            `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                                "Olá, preciso de ajuda com o app."
                            )}`
                        )
                    }
                >
                    <Ionicons name="logo-whatsapp" size={18} color="#0ea5e9" />
                    <Text style={styles.supportBtnText}>WhatsApp</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function Ajuda() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }} edges={["top", "left", "right"]}>
            {Platform.OS === "android" ? (
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            ) : null}

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
                <Text style={styles.title}>Central de Ajuda</Text>
                <Text style={styles.subtitle}>Toque em uma pergunta para ver a resposta.</Text>

                <View style={{ marginTop: 12 }}>
                    {faqs.map((f) => (
                        <AccordionItem key={f.id} item={f} />
                    ))}
                </View>

                <SupportSection />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
    subtitle: { marginTop: 4, color: "#6b7280" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    row: { flexDirection: "row", alignItems: "center" },
    iconWrap: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#e0f2fe",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    question: { flex: 1, fontSize: 15, fontWeight: "700", color: "#111827" },
    answerBox: { marginTop: 8, paddingLeft: 36, paddingRight: 8, paddingBottom: 6 },
    answer: { color: "#374151", lineHeight: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
    supportText: { color: "#374151", marginBottom: 10 },
    actionsRow: { flexDirection: "row", gap: 10 },
    supportBtn: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#bae6fd",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: "#f0f9ff",
    },
    supportBtnText: { marginLeft: 6, color: "#0c4a6e", fontWeight: "700" },
});
