import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const Colors = {
    light: {
        primary: "#4F46E5",
        secondary: "#22C55E",
        accent: "#F59E0B",
        danger: "#EF4444",

        background: "#F9FAFB",
        surface: "#FFFFFF",

        textPrimary: "#111827",
        textSecondary: "#6B7280",

        border: "#E5E7EB",
        divider: "#D1D5DB",

        muted: "#9CA3AF",
    },

    dark: {
        primary: "#6366F1",
        secondary: "#22C55E",
        accent: "#F59E0B",
        danger: "#EF4444",

        background: "#0F172A",
        surface: "#1E293B",

        textPrimary: "#F8FAFC",
        textSecondary: "#CBD5F5",

        border: "#334155",
        divider: "#475569",

        muted: "#94A3B8",
    },
};

export const Fonts = {
    size: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 22,
        title: 26,
    },

    weight: {
        light: "300",
        regular: "400",
        medium: "500",
        semiBold: "600",
        bold: "700",
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
};

export const Radius = {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
};

export const Dimension = {
    screenWidth: width,
    screenHeight: height,

    headerHeight: 56,
    tabBarHeight: 64,

    buttonHeight: 48,
    inputHeight: 46,
    cardHeight: 170,

    avatarSm: 40,
    avatarMd: 60,
    avatarLg: 96,
};

export const Shadows = {
    card: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
};
