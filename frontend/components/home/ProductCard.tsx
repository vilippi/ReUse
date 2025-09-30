import React from "react";
import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions, Platform, ImageSourcePropType } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { formatBRL } from "@/utils/currency";
import { shadowXs } from "@/utils/shadow";

export type Produto = {
    id: string;
    titulo: string;
    preco: number;
    imagem: ImageSourcePropType | string;
    freteGratis?: boolean;
    parcelas?: number;
};

type Props = { item: Produto };

export default function ProductCard({ item }: Props) {
    const parcelas = item.parcelas ?? 10;
    const valorParcela = item.preco / parcelas;
    const src = typeof item.imagem === "string" ? { uri: item.imagem } : item.imagem;

    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const IMAGE_H = isTablet ? 220 : 160;

    return (
        <Link href={`/(tabs)/home/produto/${item.id}`} asChild>
            <Pressable style={styles.card} android_ripple={{ color: "#e5e7eb" }}>
                <Image
                    source={src}
                    style={[styles.cardImage, { height: IMAGE_H }]}
                    resizeMode={isTablet ? "contain" : "cover"}
                />

                <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.titulo}
                    </Text>

                    <Text style={styles.price}>{formatBRL(item.preco)}</Text>

                    <Text style={styles.installments}>
                        em até {parcelas}x de {formatBRL(valorParcela)}
                        <Text style={{ color: "#10b981" }}> sem juros</Text>
                    </Text>

                    {item.freteGratis ? (
                        <View style={styles.badge}>
                            <Ionicons name="bicycle-outline" size={14} color="#059669" />
                            <Text style={styles.badgeText}>Frete grátis</Text>
                        </View>
                    ) : null}
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 12,
        ...shadowXs(),
    },
    cardImage: {
        width: "100%",
        backgroundColor: "#f3f4f6",
    },
    cardTitle: {
        fontSize: 14,
        color: "#111827",
        marginBottom: 6,
        fontWeight: "500",
        lineHeight: 18,
        minHeight: 36,
    },
    price: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
    },
    installments: {
        marginTop: 2,
        fontSize: 12,
        color: "#6b7280",
    },
    badge: {
        marginTop: 6,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#ecfdf5",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#d1fae5",
    },
    badgeText: {
        fontSize: 12,
        color: "#059669",
        fontWeight: "700",
    },
});
