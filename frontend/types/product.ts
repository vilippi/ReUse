export type Store = {
    id: string;
    name: string;
    rating: number; // 0-5
    sales: number;  // total vendas
};

export type Product = {
    id: string;
    title: string;
    price: number;
    installments?: number;
    images: string[];
    shippingBase?: number;
    stock: number;
    store: Store;
    description: string;
    specs: Array<{ key: string; value: string }>;
};
