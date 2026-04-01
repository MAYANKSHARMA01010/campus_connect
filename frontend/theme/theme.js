import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const Colors = {
    light: {
        primary: "#0B6BCB",
        secondary: "#10B981",
        accent: "#F97316",
        danger: "#DC2626",

        background: "#F3F6FB",
        surface: "#FFFFFF",
        surfaceSoft: "#EEF4FD",

        textPrimary: "#0F172A",
        textSecondary: "#475569",

        border: "#D7E2EF",
        divider: "#C7D3E2",

        muted: "#7C8EA5",
    },

    dark: {
        primary: "#4C9FFF",
        secondary: "#34D399",
        accent: "#FB923C",
        danger: "#F87171",

        background: "#0A1221",
        surface: "#121E32",
        surfaceSoft: "#1A2A45",

        textPrimary: "#E6EDF7",
        textSecondary: "#9DB2CC",

        border: "#263A59",
        divider: "#334968",

        muted: "#7C95B4",
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
    xxxl: 28,
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
        shadowColor: "#0B1A2B",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.09,
        shadowRadius: 14,
        elevation: 6,
    },
};
