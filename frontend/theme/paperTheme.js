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
            tertiary: colors.accent,
            background: colors.background,
            surface: colors.surface,
            surfaceVariant: colors.surfaceSoft,
            onSurface: colors.textPrimary,
            onBackground: colors.textPrimary,
            onSurfaceVariant: colors.textSecondary,
            outline: colors.border,
            outlineVariant: colors.divider,
            error: colors.danger,
        },
    };
};
