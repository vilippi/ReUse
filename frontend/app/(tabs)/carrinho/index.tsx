import { View, Text } from "react-native";

export default function Carrinho() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: "700" }}>Seu carrinho</Text>
            <Text style={{ marginTop: 8, color: "#6b7280" }}>
                Ainda não há itens no carrinho.
            </Text>
        </View>
    );
}
