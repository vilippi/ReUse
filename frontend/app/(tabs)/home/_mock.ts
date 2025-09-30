import { Produto } from "@/components/home/ProductCard";
import { ImageSourcePropType } from "react-native";

export const MOCK: Produto[] = [
    {
        id: "1",
        titulo: "iPhone 13 128GB Meia-noite",
        preco: 2999.9,
        imagem: require("../../../assets/products/iphone13.jpg") as ImageSourcePropType,
        freteGratis: true,
        parcelas: 10,
    },
    {
        id: "2",
        titulo: "Echo Dot (5ª geração) Alexa",
        preco: 229.9,
        imagem: require("../../../assets/products/echodot5a.jpg") as ImageSourcePropType,
        freteGratis: true,
        parcelas: 10,
    },
    {
        id: "3",
        titulo: "Garrafa Térmica Inox 950ml",
        preco: 139.9,
        imagem: require("../../../assets/products/garrafatermicainox950ml.webp") as ImageSourcePropType,
        freteGratis: false,
        parcelas: 6,
    },
    {
        id: "4",
        titulo: "Fone Bluetooth Over-Ear",
        preco: 179.9,
        imagem: require("../../../assets/products/foneblueoverear.webp") as ImageSourcePropType,
        freteGratis: true,
        parcelas: 10,
    },
];
