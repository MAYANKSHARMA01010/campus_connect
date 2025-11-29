import React, { useRef, useCallback } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    Animated,
    Text as RNText,
} from "react-native";
import { IconButton } from "react-native-paper";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

export default function EventHeroSlider({ images = [], onSharePress }) {
    const scrollX = useRef(new Animated.Value(0)).current;

    const renderImage = useCallback(({ item }) => {
        if (!item?.url)
            return (
                <View style={[styles.heroImage, styles.placeholder]}>
                    <RNText>No image</RNText>
                </View>
            );

        return (
            <Image
                source={item.url}
                style={styles.heroImage}
                contentFit="cover"
                transition={250}
                cachePolicy="disk"
            />
        );
    }, []);

    const dotsData = images.length ? images : [0];

    return (
        <View>
            <Animated.FlatList
                data={dotsData}
                horizontal
                pagingEnabled
                keyExtractor={(_, i) => i.toString()}
                renderItem={renderImage}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                initialNumToRender={1}
                windowSize={3}
                removeClippedSubviews
            />

            <View style={styles.topButtons}>
                <IconButton
                    icon="bookmark-outline"
                    size={26}
                    mode="contained-tonal"
                    style={styles.roundBtn}
                />
                <IconButton
                    icon="calendar-plus"
                    size={26}
                    mode="contained-tonal"
                    style={styles.roundBtn}
                />
                <IconButton
                    icon="share-variant"
                    size={26}
                    mode="contained-tonal"
                    style={styles.roundBtn}
                    onPress={onSharePress}
                />
            </View>

            <View style={styles.dotsContainer}>
                {dotsData.map((_, i) => {
                    const inputRange = [
                        (i - 1) * width,
                        i * width,
                        (i + 1) * width,
                    ];

                    const dotW = scrollX.interpolate({
                        inputRange,
                        outputRange: [6, 16, 6],
                        extrapolate: "clamp",
                    });

                    return <Animated.View key={i} style={[styles.dot, { width: dotW }]} />;
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    heroImage: { width, height: 500 },

    placeholder: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEE",
    },

    topButtons: {
        position: "absolute",
        top: 16,
        right: 16,
        flexDirection: "row",
    },

    roundBtn: {
        marginLeft: 6,
        backgroundColor: "rgba(255,255,255,0.45)",
    },

    dotsContainer: {
        position: "absolute",
        bottom: 16,
        alignSelf: "center",
        flexDirection: "row",
    },

    dot: {
        height: 6,
        borderRadius: 6,
        backgroundColor: "#fff",
        marginHorizontal: 4,
    },
});
