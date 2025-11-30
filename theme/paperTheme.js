import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { Colors } from "./theme";

export const createPaperTheme = scheme => {
    const colors = scheme === "dark" ? Colors.dark : Colors.light;
    const baseTheme = scheme === "dark" ? MD3DarkTheme : MD3LightTheme;

    return {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            primary: colors.primary,
            secondary: colors.secondary,
            background: colors.background,
            surface: colors.surface,

            onSurface: colors.textPrimary,
            onBackground: colors.textPrimary,

            outline: colors.border,
            error: colors.danger,
        },
    };
};
