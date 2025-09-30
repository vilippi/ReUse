import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function FiltrosModal() {
    const router = useRouter();
    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>Filtros</Text>
            <Text>Preço, categoria, frete grátis, condição…</Text>
            <Pressable
                onPress={() => router.back()}
                style={{ marginTop: "auto", padding: 14, backgroundColor: "#111827", borderRadius: 12 }}
            >
                <Text style={{ color: "#fff", textAlign: "center" }}>Aplicar</Text>
            </Pressable>
        </View>
    );
}
