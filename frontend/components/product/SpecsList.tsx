import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Spec = { key: string; value: string };

type Props = { description: string; specs: Spec[] };

export default function SpecsList({ description, specs }: Props) {
    return (
        <>
            <View style={styles.block}>
                <Text style={styles.sectionTitle}>Descrição do produto</Text>
                <Text style={styles.description}>{description}</Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.sectionTitle}>Características</Text>
                <View style={{ gap: 8 }}>
                    {specs.map((s, i) => (
                        <View key={i} style={styles.specRow}>
                            <Text style={styles.specKey}>{s.key}</Text>
                            <Text style={styles.specValue}>{s.value}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </>
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
    description: { color: "#374151", lineHeight: 20 },
    specRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        paddingVertical: 10,
        borderBottomColor: "#f3f4f6",
        borderBottomWidth: 1,
    },
    specKey: { color: "#6b7280", flex: 1 },
    specValue: { color: "#111827", flex: 1, textAlign: "right", fontWeight: "600" },
});
