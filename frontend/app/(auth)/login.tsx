// app/(auth)/login.tsx – Tela de Login (integrada à API + roteamento)
// Deps: expo-router, nativewind (Tailwind), @expo/vector-icons

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { saveToken } from "@/lib/secure";
import { loginRequest } from "@/lib/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 3 && password.length >= 6 && !loading;

  async function handleLogin() {
    setError(null);
    if (!canSubmit) {
      setError("Preencha e-mail válido e senha (mín. 6).");
      return;
    }
    try {
      setLoading(true);
      const { access_token } = await loginRequest(email.trim(), password);
      await saveToken(access_token);
      router.replace("/home"); // << navega para a rota concreta da aba
    } catch (e: any) {
      const msg = String(e?.message ?? "Falha ao entrar");
      setError(
        /401|credenciais|inválidas|unauthorized/i.test(msg)
          ? "E-mail ou senha incorretos"
          : msg
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-6 justify-center">
        {/* Header */}
        <View className="mb-10">
          <Text className="text-3xl font-extrabold text-[#4338CA]">ReUse</Text>
          <Text className="text-base text-gray-500 mt-1">
            Entre para continuar
          </Text>
        </View>

        {/* E-mail */}
        <View className="mb-4">
          <View className="flex-row items-center gap-2 border border-gray-200 rounded-2xl px-3 py-3">
            <Ionicons name="mail-outline" size={18} color="#6b7280" />
            <TextInput
              className="flex-1 text-base"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Senha */}
        <View className="mb-2">
          <View className="flex-row items-center gap-2 border border-gray-200 rounded-2xl px-3 py-3">
            <Ionicons name="lock-closed-outline" size={18} color="#6b7280" />
            <TextInput
              className="flex-1 text-base"
              placeholder="Senha"
              secureTextEntry={!showPass}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPass((s) => !s)}
              accessibilityLabel="Mostrar senha"
            >
              {showPass ? (
                <Ionicons name="eye-outline" size={20} color="#111827" />
              ) : (
                <Ionicons name="eye-off-outline" size={20} color="#111827" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</Text>
        </View>

        {/* Erro */}
        {error && (
          <Text className="text-red-600 text-sm mt-2" numberOfLines={2}>
            {error}
          </Text>
        )}

        {/* Botão Entrar */}
        <TouchableOpacity
          className={`mt-6 rounded-2xl py-3 items-center justify-center ${
            canSubmit ? "bg-indigo-600" : "bg-indigo-300"
          }`}
          onPress={handleLogin}
          disabled={!canSubmit}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white font-semibold text-base">Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Links */}
        <View className="mt-6 flex-row items-center justify-between">
          <Link href="/forgot" asChild>
            <TouchableOpacity>
              <Text className="text-indigo-600 font-medium">
                Esqueci minha senha
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="text-gray-700">Criar conta</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Rodapé dev (debug URL - opcional, remova quando quiser) */}
        <Text className="text-[11px] text-gray-400 mt-10">
          {`${process.env.EXPO_PUBLIC_API_URL || ""}${
            process.env.EXPO_PUBLIC_API_PREFIX ?? "/api"
          }/auth/login`}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
