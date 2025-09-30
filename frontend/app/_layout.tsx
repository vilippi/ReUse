// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationsProvider } from "@/context/NotificationsContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NotificationsProvider>
        {/* Ajuste o style conforme seu tema (auto / light / dark) */}
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false, // usamos Header próprio
          }}
        >
          {/* Tabs como root */}
          <Stack.Screen name="(tabs)" />

          {/* Modais globais */}
          <Stack.Screen
            name="(modals)/filtros"
            options={{ presentation: "modal", title: "Filtros" }}
          />

          {/* Telas fora das tabs */}
          <Stack.Screen name="notificacoes/index" options={{ headerShown: false }} />

          {/* Página global de notificações (/notificacoes) */}
          {/* Dica: você pode omitir — o expo-router já registra.
              Se quiser opções específicas, deixe explícito: */}
          <Stack.Screen name="notificacoes" />
        </Stack>
      </NotificationsProvider>
    </SafeAreaProvider>
  );
}
