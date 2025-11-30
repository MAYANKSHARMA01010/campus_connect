import React from "react";
import { View, StyleSheet, Pressable, Animated, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Entypo, Ionicons, MaterialIcons, FontAwesome6, } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/UserContext";

import HomeScreen from "../Screens/Home";
import EventScreen from "../Screens/Events";
import SearchScreen from "../Screens/Search";
import ProfileStackNavigator from "./ProfileStackNavigator";
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

  return (
    <View style={[styles.mainContainer, { paddingBottom: insets.bottom + 5 }]}>
      <BlurView intensity={90} tint="light" style={styles.tabContainer}>
        <Animated.View
          style={[
            styles.activePill,
            { transform: [{ translateX: animatedPillX }] },
          ]}
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const scaleStyle = { transform: [{ scale: animatedScale[index] }] };

          const ICONS = {
            Home: (
              <Entypo
                name="home"
                size={24}
                color={isFocused ? "#E91E63" : "#bbb"}
              />
            ),

            Search: (
              <Ionicons
                name="search"
                size={24}
                color={isFocused ? "#E91E63" : "#bbb"}
              />
            ),

            HostButton: (
              <MaterialIcons name="add-circle" size={30} color="#E91E63" />
            ),

            Events: (
              <MaterialIcons
                name="event"
                size={24}
                color={isFocused ? "#E91E63" : "#bbb"}
              />
            ),

            ProfileTab: (
              <FontAwesome6
                name="user"
                size={22}
                color={isFocused ? "#E91E63" : "#bbb"}
              />
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

      <Tabs.Screen
        name="HostButton"
        options={{ tabBarButton: () => null }}
      >
        {() => null}
      </Tabs.Screen>

      <Tabs.Screen name="Events" component={EventScreen} />

      <Tabs.Screen
        name="ProfileTab"
        component={isLoggedIn ? ProfileStackNavigator : AuthStackNavigator}
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
    paddingVertical: 18,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  activePill: {
    position: "absolute",
    width: TAB_WIDTH - 8,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 28,
    left: 4,
  },

  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
