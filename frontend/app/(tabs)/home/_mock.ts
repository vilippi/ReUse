import { Produto } from "@/components/home/ProductCard";
import { ImageSourcePropType } from "react-native";

export const MOCK: Produto[] = [
  {
    id: "r1",
    titulo: "Fardos de Papelão Reciclado (50kg)",
    preco: 249.9,
    imagem: require("../../../assets/products/papelao_reciclado.webp") as ImageSourcePropType,
    freteGratis: false,
    parcelas: 6,
  },
  {
    id: "r2",
    titulo: "Flakes de PET Transparente (25kg)",
    preco: 189.9,
    imagem: require("../../../assets/products/pet_flakes_transparente.jpg") as ImageSourcePropType,
    freteGratis: false,
    parcelas: 6,
  },
  {
    id: "r3",
    titulo: "Latas de Alumínio Prensadas (20kg)",
    preco: 379.9,
    imagem: require("../../../assets/products/latas_aluminio_prensadas.webp") as ImageSourcePropType,
    freteGratis: true,
    parcelas: 10,
  },
  {
    id: "r4",
    titulo: "Vidro Verde Moído (30kg)",
    preco: 129.9,
    imagem: require("../../../assets/products/vidro_verde_moido.jpg") as ImageSourcePropType,
    freteGratis: false,
    parcelas: 6,
  },
];
