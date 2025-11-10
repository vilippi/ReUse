// app/(auth)/login.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
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
      setError("Preencha e-mail válido e senha (mín. 6 caracteres).");
      return;
    }
    try {
      setLoading(true);
      const { access_token } = await loginRequest(email.trim(), password);
      await saveToken(access_token);
      router.replace("/home");
    } catch (e: any) {
      const msg = String(e?.message ?? "Falha ao entrar");
      setError(
        /401|credenciais|inválidas|unauthorized/i.test(msg)
          ? "E-mail ou senha incorretos."
          : msg
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* bolhas decorativas */}
      <View style={styles.bubbleRight} />
      <View style={styles.bubbleLeft} />

      <View style={styles.container}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.badge}>ReUse Marketplace</Text>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>
              Use seu e-mail e senha para continuar.
            </Text>
          </View>

          {/* E-mail */}
          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry={!showPass}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#9ca3af"
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
            <Text style={styles.helper}>Mínimo 6 caracteres.</Text>
          </View>

          {/* Erro */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Botão */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: canSubmit ? "#4f46e5" : "#a5b4fc" },
            ]}
            onPress={handleLogin}
            disabled={!canSubmit}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Links */}
          <View style={styles.linksRow}>
            <Link href="/forgot" asChild>
              <TouchableOpacity>
                <Text style={styles.linkPrimary}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkSecondary}>Criar conta</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Rodapé DEV */}
        <Text style={styles.footer}>
          {`${process.env.EXPO_PUBLIC_API_URL || ""}${
            process.env.EXPO_PUBLIC_API_PREFIX ?? "/api"
          }/auth/login`}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#e0e7ff", // indigo-100
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#4f46e5",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 3,
  },
  header: {
    marginBottom: 28,
  },
  badge: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "rgba(248,250,252,0.7)",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },
  helper: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 12,
  },
  button: {
    marginTop: 20,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  linksRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkPrimary: {
    color: "#4f46e5",
    fontWeight: "500",
    fontSize: 12,
  },
  linkSecondary: {
    color: "#0f172a",
    fontSize: 12,
  },
  footer: {
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 18,
  },
  bubbleRight: {
    position: "absolute",
    right: -50,
    top: -70,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: "rgba(99,102,241,0.35)",
  },
  bubbleLeft: {
    position: "absolute",
    left: -40,
    top: 80,
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: "rgba(186,230,253,0.6)",
  },
});
