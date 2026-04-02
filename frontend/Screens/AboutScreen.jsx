import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Appbar, Text, Surface, Divider, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

export default function AboutScreen({ navigation }) {
  const colors = useAppTheme();
  const isDark = colors.background === "#121212";

  const features = [
    {
      icon: "calendar-check",
      title: "Event Discovery",
      description: "Browse and discover college events across campuses",
    },
    {
      icon: "account-multiple",
      title: "Community Driven",
      description: "Connect with students and event organizers",
    },
    {
      icon: "bell-ring",
      title: "Smart Notifications",
      description: "Get notified about events you care about",
    },
    {
      icon: "star",
      title: "Host Events",
      description: "Create and manage your own campus events",
    },
  ];

  const teamMembers = [
    { name: "Campus Connect Team", role: "Building connections, one event at a time" },
  ];

  return (
    <>
      <Appbar.Header style={[styles.header, { backgroundColor: colors.surface }]}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Text variant="headlineSmall" style={[styles.headerTitle, { color: colors.textPrimary }]}>
          About CampusConnect
        </Text>
      </Appbar.Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[colors.primary, "#5E7CE2"]}
            style={styles.gradientBox}
          >
            <MaterialCommunityIcons
              name="calendar-check"
              size={56}
              color="white"
            />
            <Text style={[styles.heroTitle, { marginTop: Spacing.lg }]}>
              CampusConnect
            </Text>
            <Text style={styles.heroSubtitle}>
              Your Campus Events Hub
            </Text>
          </LinearGradient>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            Our Mission
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            We believe college is more than just academics. It's about building
            connections, discovering new interests, and creating unforgettable
            memories. CampusConnect makes it easy to find and participate in
            events that matter to you.
          </Text>
        </View>

        <Divider style={{ marginVertical: Spacing.lg }} />

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            Key Features
          </Text>
          <View style={styles.featureGrid}>
            {features.map((feature, index) => (
              <Surface
                key={index}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={feature.icon}
                  size={32}
                  color={colors.primary}
                />
                <Text
                  style={[
                    styles.featureTitle,
                    { color: colors.primary, marginTop: Spacing.sm },
                  ]}
                >
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: colors.textSecondary, marginTop: Spacing.xs },
                  ]}
                  numberOfLines={2}
                >
                  {feature.description}
                </Text>
              </Surface>
            ))}
          </View>
        </View>

        <Divider style={{ marginVertical: Spacing.lg }} />

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            Why Choose CampusConnect?
          </Text>

          <WhyChooseItem
            icon="lightning-bolt"
            title="Fast & Easy"
            description="Quick event discovery with intuitive search and filtering"
            colors={colors}
          />
          <WhyChooseItem
            icon="shield-check"
            title="Verified Events"
            description="All events are verified and organized by campus authorities"
            colors={colors}
          />
          <WhyChooseItem
            icon="chart-line"
            title="Grow Your Network"
            description="Connect with thousands of students across campuses"
            colors={colors}
          />
          <WhyChooseItem
            icon="heart"
            title="Community First"
            description="Built by students, for students"
            colors={colors}
          />
        </View>

        <Divider style={{ marginVertical: Spacing.lg }} />

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard
            number="50+"
            label="Campuses"
            icon="campus"
            colors={colors}
          />
          <StatCard
            number="500+"
            label="Events/Month"
            icon="calendar-multiple"
            colors={colors}
          />
          <StatCard
            number="10K+"
            label="Active Users"
            icon="account-multiple-check"
            colors={colors}
          />
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            Get in Touch
          </Text>
          <Surface
            style={[
              styles.contactCard,
              {
                backgroundColor: colors.surface,
              },
            ]}
          >
            <View style={styles.contactItem}>
              <MaterialCommunityIcons
                name="email"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                hello@campusconnect.com
              </Text>
            </View>

            <Divider style={{ marginVertical: Spacing.lg }} />

            <View style={styles.contactItem}>
              <MaterialCommunityIcons
                name="web"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                www.campusconnect.com
              </Text>
            </View>

            <Divider style={{ marginVertical: Spacing.lg }} />

            <View style={styles.contactItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                Available in major Indian colleges
              </Text>
            </View>
          </Surface>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, { color: colors.primary }]}>
            Ready to Explore?
          </Text>
          <Text style={[styles.ctaSubtitle, { color: colors.textSecondary }]}>
            Start discovering amazing events and connecting with your campus community
          </Text>
          <Button
            mode="contained"
            buttonColor={colors.primary}
            style={styles.ctaButton}
            contentStyle={styles.ctaButtonContent}
            onPress={() => navigation.navigate("Home")}
          >
            Explore Events
          </Button>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </>
  );
}

const WhyChooseItem = ({ icon, title, description, colors }) => (
  <View style={styles.whyChooseItem}>
    <MaterialCommunityIcons
      name={icon}
      size={28}
      color={colors.primary}
      style={styles.whyIcon}
    />
    <View style={styles.whyContent}>
      <Text style={[styles.whyTitle, { color: colors.primary }]}>
        {title}
      </Text>
      <Text style={[styles.whyDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  </View>
);

const StatCard = ({ number, label, icon, colors }) => (
  <Surface
    style={[
      styles.statCard,
      {
        backgroundColor: colors.surface,
      },
    ]}
  >
    <MaterialCommunityIcons
      name={icon}
      size={28}
      color={colors.primary}
    />
    <Text style={[styles.statNumber, { color: colors.primary, marginTop: Spacing.sm }]}>
      {number}
    </Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
      {label}
    </Text>
  </Surface>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },

  headerTitle: {
    marginLeft: Spacing.md,
    fontWeight: Fonts.weight.bold,
  },

  container: {
    paddingBottom: Spacing.xl,
  },

  heroSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },

  gradientBox: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },

  heroTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.bold,
    color: "#fff",
    textAlign: "center",
  },

  heroSubtitle: {
    fontSize: Fonts.size.md,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: Spacing.xs,
  },

  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
    marginBottom: Spacing.md,
  },

  sectionText: {
    fontSize: Fonts.size.sm,
    lineHeight: 22,
  },

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "space-between",
  },

  featureCard: {
    width: "48%",
    padding: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: "center",
    ...Shadows.card,
  },

  featureTitle: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
    textAlign: "center",
  },

  featureDescription: {
    fontSize: Fonts.size.xs,
    textAlign: "center",
  },

  whyChooseItem: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
    alignItems: "flex-start",
  },

  whyIcon: {
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
  },

  whyContent: {
    flex: 1,
  },

  whyTitle: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
  },

  whyDescription: {
    fontSize: Fonts.size.xs,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },

  statsContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.md,
  },

  statCard: {
    flex: 1,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    alignItems: "center",
    ...Shadows.card,
  },

  statNumber: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
  },

  statLabel: {
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.medium,
  },

  contactCard: {
    padding: Spacing.lg,
    borderRadius: Radius.md,
    ...Shadows.card,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  contactText: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.medium,
    flex: 1,
  },

  ctaSection: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },

  ctaTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
  },

  ctaSubtitle: {
    fontSize: Fonts.size.sm,
    textAlign: "center",
    marginVertical: Spacing.md,
    lineHeight: 20,
  },

  ctaButton: {
    borderRadius: Radius.md,
    minWidth: scale(200),
  },

  ctaButtonContent: {
    paddingVertical: Spacing.sm,
  },
});
