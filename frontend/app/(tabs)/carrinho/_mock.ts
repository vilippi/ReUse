import { ImageSourcePropType } from "react-native";

export type CartProduct = {
  id: string;
  name: string;
  image: ImageSourcePropType; // apenas require(...) local
  price: number; // em reais
  qty: number;
  variant?: string; // ex: "500ml", "Preto, M"
};

export const MOCK_CART: CartProduct[] = [
  {
    id: "p1",
    name: "Fardos de Papelão Reciclado (50kg)",
    image: require("../../../assets/products/papelao_reciclado.jpg"),
    price: 249.9,
    qty: 2,
  },
  {
    id: "p2",
    name: "Flakes de PET Transparente (25kg)",
    image: require("../../../assets/products/pet_flakes_transparente.jpg"),
    price: 12.5,
    qty: 1,
  },
];
