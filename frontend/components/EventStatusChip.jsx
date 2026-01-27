import React from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

export default function EventStatusChip({ status, style }) {
    switch (status) {
        case "APPROVED":
            return (
                <Chip textStyle={{ color: "green" }} style={[styles.approved, style]}>
                    APPROVED
                </Chip>
            );
        case "REJECTED":
            return (
                <Chip textStyle={{ color: "red" }} style={[styles.rejected, style]}>
                    REJECTED
                </Chip>
            );
        default:
            return (
                <Chip textStyle={{ color: "orange" }} style={[styles.pending, style]}>
                    PENDING
                </Chip>
            );
    }
}

const styles = StyleSheet.create({
    approved: {
        backgroundColor: "rgba(0, 200, 0, 0.15)",
    },
    pending: {
        backgroundColor: "rgba(255, 165, 0, 0.15)",
    },
    rejected: {
        backgroundColor: "rgba(255, 0, 0, 0.15)",
    },
});
