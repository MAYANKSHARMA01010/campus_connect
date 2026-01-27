import { useColorScheme } from "react-native";
import { Colors } from "./theme";

export const useAppTheme = () => {
  const scheme = useColorScheme();
  return scheme === "dark" ? Colors.dark : Colors.light;
};
