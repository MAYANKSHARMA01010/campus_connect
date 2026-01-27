import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  useColorScheme,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import {
  Entypo,
  Ionicons,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/UserContext";
import { useAppTheme } from "../theme/useAppTheme";
import { Radius, Spacing } from "../theme/theme";
import { scale } from "../theme/layout";

import HomeScreen from "../Screens/Home";
import EventScreen from "../Screens/Events";
import SearchScreen from "../Screens/Search";

import SettingsStackNavigator from "./SettingsStackNavigator";
import AuthStackNavigator from "./AuthStackNavigator";

const Tabs = createBottomTabNavigator();

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = (SCREEN_WIDTH * 0.9) / 5;

const animatedScale = Array(5)
  .fill(0)
  .map(() => new Animated.Value(1));

const animatedPillX = new Animated.Value(0);

function animateTab(index) {
  animatedScale.forEach((v, i) => {
    Animated.spring(v, {
      toValue: i === index ? 1.22 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 160,
    }).start();
  });

  Animated.spring(animatedPillX, {
    toValue: index * TAB_WIDTH,
    useNativeDriver: true,
    friction: 8,
    tension: 140,
  }).start();
}

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { role } = useAuth();
  const colors = useAppTheme();
  const scheme = useColorScheme();

  return (
    <View
      style={[
        styles.mainContainer,
        { paddingBottom: insets.bottom + Spacing.sm },
      ]}
    >
      <BlurView
        intensity={90}
        tint={scheme === "dark" ? "dark" : "light"}
        style={[
          styles.tabContainer,
          {
            backgroundColor:
              scheme === "dark"
                ? "rgba(30,41,59,0.55)"
                : "rgba(255,255,255,0.45)",
            borderColor: colors.border,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.activePill,
            {
              width: TAB_WIDTH - scale(8),
              backgroundColor: colors.primary,
              transform: [{ translateX: animatedPillX }],
            },
          ]}
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const scaleStyle = { transform: [{ scale: animatedScale[index] }] };

          const iconColor = isFocused ? colors.primary : colors.muted;

          const ICONS = {
            Home: <Entypo name="home" size={scale(24)} color={iconColor} />,
            Search: (
              <Ionicons name="search" size={scale(24)} color={iconColor} />
            ),
            HostButton: (
              <MaterialIcons
                name="add-circle"
                size={scale(32)}
                color={colors.accent}
              />
            ),
            Events: (
              <MaterialIcons name="event" size={scale(24)} color={iconColor} />
            ),
            ProfileTab: (
              <FontAwesome6 name="user" size={scale(22)} color={iconColor} />
            ),
          };

          return (
            <Pressable
              key={route.key}
              style={styles.tabButton}
              onPress={() => {
                animateTab(index);

                if (route.name === "HostButton") {
                  const target =
                    role === "ADMIN" ? "ManageEvents" : "HostEvent";

                  navigation.getParent()?.navigate(target);
                  return;
                }

                navigation.navigate(route.name);
              }}
            >
              <Animated.View style={[styles.iconWrapper, scaleStyle]}>
                {ICONS[route.name]}
              </Animated.View>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

export default function BottomNavigationMainScreen() {
  const { isLoggedIn } = useAuth();

  return (
    <Tabs.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Search" component={SearchScreen} />

      <Tabs.Screen name="HostButton" options={{ tabBarButton: () => null }}>
        {() => null}
      </Tabs.Screen>

      <Tabs.Screen name="Events" component={EventScreen} />

      
      <Tabs.Screen
        name="ProfileTab"
        component={isLoggedIn ? SettingsStackNavigator : AuthStackNavigator}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },

  tabContainer: {
    flexDirection: "row",
    width: "90%",
    paddingVertical: Spacing.lg,
    borderRadius: Radius.pill,
    overflow: "hidden",
    borderWidth: 1,
  },

  activePill: {
    position: "absolute",
    height: scale(44),
    borderRadius: Radius.pill,
    left: scale(4),
    opacity: 0.2,
    marginTop: 15,
  },

  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapper: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(40),
    justifyContent: "center",
    alignItems: "center",
  },
});
