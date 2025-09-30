import React, { useRef } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = Math.round(SCREEN_WIDTH * 0.75);

type Props = {
    images: string[];
    index: number;
    onIndexChange: (i: number) => void;
};

export default function ImageCarousel({ images, index, onIndexChange }: Props) {
    const sliderRef = useRef<FlatList<string>>(null);

    const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        onIndexChange(i);
    };

    return (
        <View style={styles.galleryWrap}>
            <FlatList
                ref={sliderRef}
                data={images}
                keyExtractor={(uri, idx) => uri + idx}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScrollEnd}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
                )}
            />
            <View style={styles.dots}>
                {images.map((_, i) => (
                    <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    galleryWrap: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT, backgroundColor: "#fff" },
    galleryImage: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT },
    dots: {
        position: "absolute",
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#e5e7eb" },
    dotActive: { backgroundColor: "#111827" },
});
