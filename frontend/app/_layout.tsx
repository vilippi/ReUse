// app/_layout.tsx
import { Stack, router, usePathname } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getValidToken } from "@/lib/auth";
import { clearToken } from "@/lib/secure"; // << ADICIONADO

// Rotas públicas (sem login)
const ANON_ROUTES = ["/login", "/forgot", "/register"];
const HOME = "/home";

// ⚠️ DEV: limpar token no boot para testar fluxo de login
const DEV_CLEAR_TOKEN_ON_BOOT = true; // mude para false/remova depois dos testes

function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const navigatingRef = useRef(false); // evita replace encadeado

  // BOOT: limpa token (se habilitado) e só então checa token válido
  useEffect(() => {
    (async () => {
      if (DEV_CLEAR_TOKEN_ON_BOOT) {
        await clearToken();
        console.log("[DEV] Token limpo no boot");
      }
      const token = await getValidToken();
      setAuthed(!!token);
      setReady(true);
    })();
  }, []);

  // Re-checa ao ganhar foco (após login/voltar ao app)
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const token = await getValidToken();
        if (!cancelled) setAuthed(!!token);
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  // Re-checa quando a rota mudar (evita corrida pós router.replace)
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      const token = await getValidToken();
      if (!cancelled) setAuthed(!!token);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, ready]);

  // Redirecionamentos
  useEffect(() => {
    if (!ready || authed === null) return;
    if (navigatingRef.current) return; // já está navegando

    const isAnonPath = pathname
      ? ANON_ROUTES.some((r) => pathname === r || pathname.endsWith(r))
      : false;

    // Sem auth -> força /login (se não for rota pública)
    if (!authed && !isAnonPath && pathname !== "/login") {
      navigatingRef.current = true;
      router.replace("/login");
      setTimeout(() => (navigatingRef.current = false), 0);
      return;
    }

    // Autenticado em rota pública -> manda para HOME concreta
    if (authed && isAnonPath && pathname !== HOME) {
      navigatingRef.current = true;
      router.replace(HOME);
      setTimeout(() => (navigatingRef.current = false), 0);
      return;
    }
  }, [ready, authed, pathname]);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NotificationsProvider>
        <StatusBar style="auto" />
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Tabs como root (group) */}
            <Stack.Screen name="(tabs)" />

            {/* Modais globais */}
            <Stack.Screen
              name="(modals)/filtros"
              options={{ presentation: "modal", title: "Filtros" }}
            />

            {/* Telas fora das tabs */}
            <Stack.Screen name="notificacoes/index" options={{ headerShown: false }} />
            <Stack.Screen name="notificacoes" />
          </Stack>
        </AuthGate>
      </NotificationsProvider>
    </SafeAreaProvider>
  );
}
