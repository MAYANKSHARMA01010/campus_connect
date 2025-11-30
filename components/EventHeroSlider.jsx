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

import { useAppTheme } from "../theme/useAppTheme";
import { Spacing, Radius } from "../theme/theme";
import { scale } from "../theme/layout";

const { width } = Dimensions.get("window");

export default function EventHeroSlider({ images = [], onSharePress }) {
    const colors = useAppTheme();
    const scrollX = useRef(new Animated.Value(0)).current;

    const renderImage = useCallback(
        ({ item }) => {
            if (!item?.url)
                return (
                    <View
                        style={[
                            styles.heroImage,
                            styles.placeholder,
                            { backgroundColor: colors.border },
                        ]}
                    >
                        <RNText style={{ color: colors.textSecondary }}>No image</RNText>
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
        },
        [colors]
    );

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

            {/* Action Buttons */}
            <View style={styles.topButtons}>
                <IconButton
                    icon="bookmark-outline"
                    size={scale(24)}
                    mode="contained-tonal"
                    style={[styles.roundBtn, { backgroundColor: colors.surface }]}
                    iconColor={colors.primary}
                />

                <IconButton
                    icon="calendar-plus"
                    size={scale(24)}
                    mode="contained-tonal"
                    style={[styles.roundBtn, { backgroundColor: colors.surface }]}
                    iconColor={colors.primary}
                />

                <IconButton
                    icon="share-variant"
                    size={scale(24)}
                    mode="contained-tonal"
                    style={[styles.roundBtn, { backgroundColor: colors.surface }]}
                    iconColor={colors.primary}
                    onPress={onSharePress}
                />
            </View>

            {/* Slider Dots */}
            <View style={styles.dotsContainer}>
                {dotsData.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                    const dotW = scrollX.interpolate({
                        inputRange,
                        outputRange: [scale(6), scale(16), scale(6)],
                        extrapolate: "clamp",
                    });

                    return (
                        <Animated.View
                            key={i}
                            style={[
                                styles.dot,
                                {
                                    width: dotW,
                                    backgroundColor: colors.surface,
                                },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    heroImage: {
        width,
        height: scale(280),
    },

    placeholder: {
        justifyContent: "center",
        alignItems: "center",
    },

    topButtons: {
        position: "absolute",
        top: Spacing.md,
        right: Spacing.md,
        flexDirection: "row",
    },

    roundBtn: {
        marginLeft: Spacing.sm,
        borderRadius: Radius.pill,
    },

    dotsContainer: {
        position: "absolute",
        bottom: Spacing.md,
        alignSelf: "center",
        flexDirection: "row",
    },

    dot: {
        height: scale(6),
        borderRadius: Radius.pill,
        marginHorizontal: Spacing.xs,
        opacity: 0.85,
    },
});
