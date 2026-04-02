import { useThemeMode } from "../context/ThemeContext";
import { Colors } from "./theme";

export const useAppTheme = () => {
  const { isDark } = useThemeMode();
  return isDark ? Colors.dark : Colors.light;
};
