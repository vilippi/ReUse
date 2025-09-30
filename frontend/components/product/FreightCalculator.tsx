import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatBRL } from "@/utils/currency";

type Shipping = { price: number; eta: string } | null;

type Props = {
    cep: string;
    onCepChange: (v: string) => void;
    shipping: Shipping;
    onCalc: () => void;
};

export default function FreightCalculator({ cep, onCepChange, shipping, onCalc }: Props) {
    return (
        <View style={styles.block}>
            <Text style={styles.sectionTitle}>Frete</Text>

            <View style={styles.freightRow}>
                <Ionicons name="location-outline" size={18} color="#374151" />
                <TextInput
                    placeholder="Seu CEP"
                    keyboardType="number-pad"
                    value={cep}
                    onChangeText={onCepChange}
                    style={styles.cepInput}
                    maxLength={9}
                />
                <Pressable onPress={onCalc} style={styles.calcButton}>
                    <Text style={styles.calcButtonText}>Calcular</Text>
                </Pressable>
            </View>

            {shipping ? (
                <View style={styles.shippingResult}>
                    <Text style={styles.shippingText}>
                        {formatBRL(shipping.price)} • Entrega em {shipping.eta}
                    </Text>
                </View>
            ) : (
                <Text style={styles.hint}>Informe um CEP válido (8 dígitos) para estimar o frete.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#fff",
        gap: 10,
        elevation: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
    freightRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    cepInput: {
        flex: 1,
        height: 44,
        backgroundColor: "#f3f4f6",
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    calcButton: {
        paddingHorizontal: 12,
        height: 44,
        backgroundColor: "#111827",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    calcButtonText: { color: "#fff", fontWeight: "700" },
    shippingResult: { marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: "#ecfeff" },
    shippingText: { color: "#0e7490", fontWeight: "600" },
    hint: { color: "#6b7280" },
});
