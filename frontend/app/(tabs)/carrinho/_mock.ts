export type CartProduct = {
    id: string;
    name: string;
    image: string;
    price: number; // em reais
    qty: number;
    variant?: string; // ex: "500ml", "Preto, M"
};

export const MOCK_CART: CartProduct[] = [
    {
        id: "p1",
        name: "Shampoo Orgânico",
        image: "https://picsum.photos/seed/p1/200/200",
        price: 24.9,
        qty: 2,
        variant: "500ml",
    },
    {
        id: "p2",
        name: "Sabonete Natural",
        image: "https://picsum.photos/seed/p2/200/200",
        price: 12.5,
        qty: 1,
        variant: "Capim-limão",
    },
];
