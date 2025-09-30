import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import StoreCard from "@/components/product/StoreCard";
import ImageCarousel from "@/components/product/ImageCarousel";
import PriceBlock from "@/components/product/PriceBlock";
import FreightCalculator from "@/components/product/FreightCalculator";
import QuantitySelector from "@/components/product/QuantitySelector";
import SpecsList from "@/components/product/SpecsList";
import ActionBar from "@/components/product/ActionBar";

import { MOCK_PRODUCTS } from "@/lib/product/mock";
import { Product } from "@/types/product";

export default function ProdutoDetalhe() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();

    // Pode estar fora de Tabs. Se falhar, considera 0.
    let tabBarHeight = 0;
    try {
        tabBarHeight = useBottomTabBarHeight();
    } catch {
        tabBarHeight = 0;
    }

    const product = useMemo<Product | undefined>(() => MOCK_PRODUCTS[id ?? "1"], [id]);

    const [qty, setQty] = useState(1);
    const [cep, setCep] = useState("");
    const [shipping, setShipping] = useState<{ price: number; eta: string } | null>(null);
    const [imageIndex, setImageIndex] = useState(0);

    if (!product) {
        return (
            <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
                <View style={styles.container}>
                    <Text style={styles.title}>Produto não encontrado</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Lógica do frete (mock)
    const handleCalcShipping = () => {
        const clean = cep.replace(/\D/g, "");
        if (clean.length < 8) {
            setShipping(null);
            return;
        }
        const last = Number(clean.slice(-2));
        const extra = (last % 5) * 2;
        const price = (product.shippingBase ?? 24.9) + extra;
        const etaDays = 2 + (last % 5);
        setShipping({ price, eta: `${etaDays}-${etaDays + 2} dias úteis` });
    };

    // Qty handlers
    const dec = () => setQty((q) => Math.max(1, q - 1));
    const inc = () => setQty((q) => Math.min(product.stock, q + 1));

    // Ações
    const addToCart = () => {
        console.log("add to cart", { productId: product.id, qty });
    };
    const buyNow = () => {
        console.log("buy now", { productId: product.id, qty });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 20,
                }}
            >
                <StoreCard store={product.store} />
                <ImageCarousel images={product.images} index={imageIndex} onIndexChange={setImageIndex} />
                <PriceBlock title={product.title} price={product.price} installments={product.installments} />
                <FreightCalculator
                    cep={cep}
                    onCepChange={setCep}
                    shipping={shipping}
                    onCalc={handleCalcShipping}
                />
                <QuantitySelector qty={qty} stock={product.stock} onDec={dec} onInc={inc} />
                <SpecsList description={product.description} specs={product.specs} />
                <View style={{ height: 20 }} />
            </ScrollView>

            <ActionBar onAddToCart={addToCart} onBuyNow={buyNow} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f3f4f6" },
    container: { flex: 1, backgroundColor: "#f3f4f6" },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
        marginTop: 24,
    },
});
