// src/app/(tabs)/vender-produto/_mock.ts

export const CATEGORIAS = [
    { id: "eletronicos", label: "Eletrônicos" },
    { id: "moveis", label: "Móveis" },
    { id: "roupas", label: "Roupas" },
    { id: "esporte", label: "Esportes" },
    { id: "livros", label: "Livros" },
    { id: "outros", label: "Outros" },
];

export const CONDICOES = [
    { id: "novo", label: "Novo" },
    { id: "semi_novo", label: "Seminovo" },
    { id: "usado", label: "Usado" },
];

// Mock de sugestão de preço por categoria (se quiser usar)
export const PRECO_SUGERIDO = {
    eletronicos: 200.0,
    moveis: 100.0,
    roupas: 30.0,
    esporte: 80.0,
    livros: 20.0,
    outros: 50.0,
} as Record<string, number>;
