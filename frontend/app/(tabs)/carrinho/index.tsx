import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// ajuste se o path mudar
import CartItem from "@/components/carrinho/CartItem";
import PriceRow from "@/components/carrinho/PriceRow";
import { CartProduct, MOCK_CART } from "./_mock";

export default function Carrinho() {
  const router = useRouter();
  const [items, setItems] = useState<CartProduct[]>(MOCK_CART);

  const currency = (n: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
    const frete = items.length > 0 ? 12.9 : 0; // mock
    const desconto = subtotal > 100 ? 10 : 0; // mock
    const total = Math.max(0, subtotal + frete - desconto);
    return { subtotal, frete, desconto, total };
  }, [items]);

  const inc = (id: string) =>
    setItems(prev => prev.map(it => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));

  const dec = (id: string) =>
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it))
    );

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(it => it.id !== id));

  const empty = items.length === 0;

  const checkout = () => {
    if (empty) return;
    // Navegação mock para uma tela de confirmação de pedido
    router.push("/home"); // crie uma tela simples de sucesso, se quiser
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }} edges={["top", "left", "right"]}>
      {Platform.OS === "android" ? (
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      ) : null}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seu carrinho</Text>
        <Ionicons name="cart-outline" size={22} color="#111827" />
      </View>

      {/* Conteúdo */}
      {empty ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Ainda não há itens no carrinho.</Text>
          <Text style={styles.emptyText}>
            Explore os produtos e adicione seus favoritos aqui.
          </Text>
          <Pressable
            style={styles.cta}
            onPress={() => router.push("/home")} // ajuste a rota que desejar
          >
            <Text style={styles.ctaText}>Ver ofertas</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            contentInsetAdjustmentBehavior="automatic"
          >
            <Text style={styles.sectionTitle}>Itens</Text>
            <View style={{ paddingHorizontal: 16, gap: 10 }}>
              {items.map(it => (
                <CartItem
                  key={it.id}
                  item={it}
                  onInc={inc}
                  onDec={dec}
                  onRemove={removeItem}
                  currency={currency}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Resumo</Text>
            <View style={styles.summaryCard}>
              <PriceRow label="Subtotal" value={currency(totals.subtotal)} />
              <PriceRow
                label="Frete"
                value={totals.frete === 0 ? "Grátis" : currency(totals.frete)}
              />
              {totals.desconto > 0 && (
                <PriceRow label="Desconto" value={`- ${currency(totals.desconto)}`} />
              )}
              <View style={styles.divider} />
              <PriceRow label="Total" value={currency(totals.total)} strong />
            </View>
          </ScrollView>

          {/* Footer de ação */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{currency(totals.total)}</Text>
            </View>
            <Pressable
              style={[styles.buyBtn, empty && { opacity: 0.5 }]}
              onPress={checkout}
              disabled={empty}
            >
              <Text style={styles.buyText}>Finalizar compra</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

/* -------- Styles -------- */
const styles = StyleSheet.create({
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  emptyText: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  cta: {
    marginTop: 10,
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaText: { color: "#fff", fontWeight: "700" },

  summaryCard: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: { fontSize: 12, color: "#6b7280" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#111827" },
  buyBtn: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buyText: { color: "#fff", fontWeight: "800" },
});
