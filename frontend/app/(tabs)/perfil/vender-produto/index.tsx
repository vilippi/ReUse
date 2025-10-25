// src/app/(tabs)/vender-produto.tsx
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIAS, CONDICOES, PRECO_SUGERIDO } from "./_mock";

type Foto = { uri: string };

export default function VenderProduto() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [preco, setPreco] = useState<string>(""); // como texto para máscara
  const [condicao, setCondicao] = useState<string>("");
  const [descricao, setDescricao] = useState("");
  const [doacao, setDoacao] = useState(false);
  const [retiradaLocal, setRetiradaLocal] = useState(true);

  // máscara simples R$
  const precoNumber = useMemo(() => {
    const clean = preco.replace(/[^\d]/g, "");
    return Number((Number(clean) / 100).toFixed(2));
  }, [preco]);

  function formatCurrencyBRL(v: number) {
    try {
      return v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    } catch {
      return `R$ ${v.toFixed(2)}`;
    }
  }

  function handlePrecoChange(text: string) {
    const clean = text.replace(/[^\d]/g, "");
    const n = Number(clean || "0");
    const val = (n / 100).toFixed(2).replace(".", ",");
    setPreco(`R$ ${val}`);
  }

  async function pickImages() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos acessar suas fotos para criar o anúncio.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const selected = result.assets.map((a) => ({ uri: a.uri }));
      setFotos((prev) => {
        const merged = [...prev, ...selected].slice(0, 5); // até 5 fotos
        return merged;
      });
    }
  }

  function removeFoto(index: number) {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  }

  function validar(): string[] {
    const errs: string[] = [];
    if (fotos.length === 0) errs.push("Adicione pelo menos 1 foto.");
    if (!titulo.trim()) errs.push("Informe um título.");
    if (!categoria) errs.push("Selecione uma categoria.");
    if (!doacao && precoNumber <= 0) errs.push("Informe um preço válido ou marque como doação.");
    if (!condicao) errs.push("Selecione a condição do produto.");
    return errs;
  }

  function limpar() {
    setFotos([]);
    setTitulo("");
    setCategoria("");
    setPreco("");
    setCondicao("");
    setDescricao("");
    setDoacao(false);
    setRetiradaLocal(true);
  }

  async function onPublicar() {
    const erros = validar();
    if (erros.length) {
      Alert.alert("Verifique os campos", erros.join("\n"));
      return;
    }

    // Aqui você integraria com sua API:
    // const body = new FormData();
    // fotos.forEach((f, i) => body.append("imagens", { uri: f.uri, name: `foto_${i}.jpg`, type: "image/jpeg" } as any));
    // body.append("titulo", titulo);
    // body.append("categoria", categoria);
    // body.append("preco", doacao ? "0" : String(precoNumber));
    // body.append("condicao", condicao);
    // body.append("descricao", descricao);
    // body.append("retiradaLocal", String(retiradaLocal));
    //
    // await fetch("/api/anuncios", { method: "POST", body });

    Alert.alert("Sucesso", "Seu anúncio foi publicado!");
    limpar();
  }

  function sugerirPreco() {
    if (!categoria) return;
    const sug = PRECO_SUGERIDO[categoria];
    if (sug) {
      // coloca já formatado
      const cents = Math.round(sug * 100);
      const val = (cents / 100).toFixed(2).replace(".", ",");
      setPreco(`R$ ${val}`);
    }
  }

  const canSugerir = !!categoria && !doacao;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
      {Platform.OS === "android" ? (
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      ) : null}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Criar anúncio</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Fotos */}
        <Text style={styles.label}>Fotos (até 5)</Text>
        <View style={styles.fotosWrap}>
          <Pressable onPress={pickImages} style={[styles.fotoBox, styles.fotoAdd]}>
            <Ionicons name="camera-outline" size={22} color="#0ea5e9" />
            <Text style={{ color: "#0ea5e9", marginTop: 6, fontWeight: "600" }}>Adicionar</Text>
          </Pressable>

          {fotos.map((f, i) => (
            <View key={f.uri + i} style={styles.fotoBox}>
              <Image source={{ uri: f.uri }} style={styles.foto} />
              <Pressable onPress={() => removeFoto(i)} style={styles.fotoRemove}>
                <Ionicons name="close" size={14} color="#fff" />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Título */}
        <Text style={styles.label}>Título</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex.: iPhone 12 128GB"
          style={styles.input}
          maxLength={80}
        />

        {/* Categoria */}
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pills}>
          {CATEGORIAS.map((c) => {
            const active = c.id === categoria;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategoria(c.id)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Preço + botão */}
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.label}>Preço</Text>

            <Pressable
              onPress={sugerirPreco}
              disabled={!canSugerir}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSugerir }}
              accessibilityHint={
                canSugerir
                  ? "Sugere um preço com base na categoria selecionada."
                  : "Selecione uma categoria para habilitar esta sugestão."
              }
              style={({ pressed }) => [
                { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8 },
                !canSugerir && { opacity: 0.4 },
                pressed && canSugerir && { opacity: 0.7 },
              ]}
            >
              <Text style={{ color: canSugerir ? "#0ea5e9" : "#9ca3af", fontWeight: "600" }}>
                Sugerir preço
              </Text>
            </Pressable>
          </View>

          {/* Help text abaixo do título */}
          {!categoria && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="information-circle-outline" size={16} color="#9ca3af" />
              <Text style={{ marginLeft: 2, color: "#9ca3af", fontSize: 12 }}>
                Selecione uma categoria para habilitar a sugestão de preço.
              </Text>
            </View>
          )}
        </View>


        <View style={{ flexDirection: "row", gap: 10, marginTop:10 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              value={doacao ? "R$ 0,00" : preco}
              onChangeText={handlePrecoChange}
              placeholder="R$ 0,00"
              keyboardType="numeric"
              style={[styles.input, doacao && { backgroundColor: "#f3f4f6", color: "#6b7280" }]}
              editable={!doacao}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Doação</Text>
            <Switch value={doacao} onValueChange={setDoacao} thumbColor={doacao ? "#16a34a" : undefined} />
          </View>
        </View>

        {/* Condição */}
        <Text style={styles.label}>Condição</Text>
        <View style={styles.pills}>
          {CONDICOES.map((c) => {
            const active = c.id === condicao;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCondicao(c.id)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Conte detalhes importantes, estado do produto, itens inclusos..."
          multiline
          numberOfLines={5}
          style={[styles.input, { height: 120, textAlignVertical: "top" }]}
          maxLength={1000}
        />

        {/* Opções de entrega */}
        <View style={[styles.cardRow, { marginTop: 8 }]}>
          <Ionicons name="navigate-circle-outline" size={20} color="#6b7280" />
          <Text style={{ flex: 1, marginLeft: 8, color: "#111827", fontWeight: "600" }}>
            Retirada no local
          </Text>
          <Switch
            value={retiradaLocal}
            onValueChange={setRetiradaLocal}
            thumbColor={retiradaLocal ? "#0ea5e9" : undefined}
          />
        </View>

        {/* Resumo rápido */}
        <View style={styles.resumo}>
          <Text style={styles.resumoText}>
            {doacao ? "Anúncio de doação" : `Preço: ${formatCurrencyBRL(precoNumber)}`}
          </Text>
          <Text style={styles.resumoText}>
            {categoria ? `Categoria: ${CATEGORIAS.find((c) => c.id === categoria)?.label}` : "Sem categoria"}
          </Text>
          <Text style={styles.resumoText}>
            {condicao ? `Condição: ${CONDICOES.find((c) => c.id === condicao)?.label}` : "Sem condição"}
          </Text>
        </View>

        {/* Ações */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={limpar}>
            <Text style={[styles.btnText, styles.btnTextOutline]}>Limpar</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onPublicar}>
            <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
            <Text style={[styles.btnText, { color: "#fff", marginLeft: 8 }]}>Publicar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 6,
  },

  fotosWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  fotoBox: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  fotoAdd: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#0ea5e9",
  },
  foto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fotoRemove: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#111827aa",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },

  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pillActive: {
    backgroundColor: "#e0f2fe",
    borderColor: "#0ea5e9",
  },
  pillText: { color: "#111827", fontWeight: "600" },
  pillTextActive: { color: "#0369a1" },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  toggleLabel: {
    color: "#111827",
    fontWeight: "600",
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },

  resumo: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 4,
  },
  resumoText: {
    color: "#374151",
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnPrimary: { backgroundColor: "#0ea5e9" },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },
  btnText: { fontSize: 16, fontWeight: "700" },
  btnTextOutline: { color: "#0ea5e9" },
});
