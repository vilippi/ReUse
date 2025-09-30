import { View, Text } from "react-native";

export default function Perfil() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: "700" }}>Minha conta</Text>
            <Text>Pedidos, favoritos, endereços, pagamentos…</Text>
        </View>
    );
}