import React from "react";
import { FlatList } from "react-native";
import ProductCard, { Produto } from "./ProductCard";

type Props = { data: Produto[] };

export default function ProductGrid({ data }: Props) {
    return (
        <FlatList
            data={data}
            keyExtractor={(i) => i.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            columnWrapperStyle={{ gap: 12, justifyContent: "space-between" }}
            renderItem={({ item }) => <ProductCard item={item} />}
        />
    );
}
