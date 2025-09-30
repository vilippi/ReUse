import { Product } from "@/types/product";

export const MOCK_PRODUCTS: Record<string, Product> = {
    "1": {
        id: "1",
        title: "Garrafa Térmica Inox 750ml - Biodegradável",
        price: 129.9,
        installments: 10,
        images: [
            "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop",
        ],
        shippingBase: 19.9,
        stock: 20,
        store: { id: "eco-store", name: "Eco Store Oficial", rating: 4.8, sales: 1234 },
        description:
            "Garrafa térmica em aço inox com revestimento biodegradável. Mantém bebidas geladas por 24h e quentes por 12h. Livre de BPA.",
        specs: [
            { key: "Material", value: "Aço inox + revestimento biodegradável" },
            { key: "Capacidade", value: "750 ml" },
            { key: "Livre de BPA", value: "Sim" },
            { key: "Isolamento", value: "Vácuo, parede dupla" },
            { key: "Garantia", value: "12 meses" },
        ],
    },
};
