import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, useWindowDimensions, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

type Category = {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    tint: string;
    route?: string;
};

const DATA: Category[] = [
    { id: "ofertas",        label: "Ofertas",         icon: "pricetags-outline",  tint: "#2563eb", route: "/ofertas" },
    { id: "lojas",          label: "Lojas Oficiais",  icon: "storefront-outline" as any, tint: "#16a34a", route: "/lojas" },
    { id: "mais-vendidos",  label: "Mais Vendidos",   icon: "trophy-outline",     tint: "#f59e0b", route: "/mais-vendidos" },
    { id: "cupons",         label: "Cupons",          icon: "ticket-outline",     tint: "#ef4444", route: "/cupons" },
];

type Props = {
    onPressItem?: (id: string) => void;
    data?: Category[];
};

export default function CategoryCarousel({ onPressItem, data = DATA }: Props) {
    const router = useRouter();
    const { width } = useWindowDimensions();

    // Classificação simples por largura
    const deviceKind = useMemo<"phone" | "phoneLarge" | "tablet" | "tabletLarge">(() => {
        if (width >= 1024) return "tabletLarge";
        if (width >= 768)  return "tablet";
        if (width >= 430)  return "phoneLarge"; // ex.: iPhone Plus / Androids grandes
        return "phone";
    }, [width]);

    // Mapa de alturas por dispositivo (em dp)
    const CAROUSEL_HEIGHT: Record<typeof deviceKind, number> = {
        phone:       104,
        phoneLarge:  110,
        tablet:      120,
        tabletLarge: 128,
    };

    // Tamanhos internos coerentes com a altura escolhida
    const sizes = useMemo(() => {
        const baseCircle = { phone: 48, phoneLarge: 52, tablet: 56, tabletLarge: 60 }[deviceKind];
        const baseIcon   = { phone: 20, phoneLarge: 22, tablet: 24, tabletLarge: 26 }[deviceKind];
        const baseItemW  = { phone: 80, phoneLarge: 86, tablet: 90, tabletLarge: 96 }[deviceKind];
        const fontSize   = { phone: 11, phoneLarge: 12, tablet: 12, tabletLarge: 12 }[deviceKind];
        const lineHeight = 16;                 
        const minLabelH  = lineHeight * 2;     
        const marginTopLabel = 6;              
        const verticalPad = 8;                 
        return {
            circleSize: baseCircle,
            iconSize: baseIcon,
            itemWidth: baseItemW,
            fontSize,
            lineHeight,
            minLabelH,
            marginTopLabel,
            verticalPad,
        };
    }, [deviceKind]);

    // Altura fixa que manda no layout
    const listHeight = CAROUSEL_HEIGHT[deviceKind];

    return (
        
        <View style={{ height: listHeight }}>
            <FlatList
                horizontal
                style={{ flex: 1 }}
                data={data}
                keyExtractor={(i) => i.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 12,
                    paddingVertical: sizes.verticalPad,
                    alignItems: "center",
                }}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                renderItem={({ item }) => (
                    <Pressable
                        style={[styles.item, { width: sizes.itemWidth }]}
                        android_ripple={Platform.OS === "android" ? { color: "#e5e7eb", borderless: false } : undefined}
                        onPress={() => {
                            onPressItem?.(item.id);
                            if (item.route) router.push(item.route as any);
                        }}
                    >
                        <View
                            style={[
                                styles.circle,
                                {
                                    borderColor: item.tint,
                                    width: sizes.circleSize,
                                    height: sizes.circleSize,
                                    borderRadius: sizes.circleSize / 2,
                                },
                            ]}
                        >
                            <Ionicons name={item.icon} size={sizes.iconSize} color={item.tint} />
                        </View>

                        <Text
                            style={[
                                styles.label,
                                {
                                    fontSize: sizes.fontSize,
                                    lineHeight: sizes.lineHeight,
                                    minHeight: sizes.minLabelH,
                                    marginTop: sizes.marginTopLabel,
                                },
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            allowFontScaling={false}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
    },
    circle: {
        backgroundColor: "#fff",
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        color: "#111827",
        textAlign: "center",
        fontWeight: "500",
    },
});
