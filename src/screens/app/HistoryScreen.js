import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    FlatList,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "../../components/AppText";
import { formatCurrency } from "../../services/formatters";
import { useHistory } from "../../context/HistoryContext";

const NAVY = "#1A237E";
const GREEN = "#00A650";
const CREAM = "#F5F1E8";

export default function HistoryScreen({ navigation }) {

    const { history } = useHistory();

    const renderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.cardIndicator} />
            <View style={styles.orderContent}>
                <View>

                    <AppText style={styles.orderId}>
                        Pedido #{item.id ? item.id.slice(-6) : "000000"}
                    </AppText>
                    <AppText variant="muted" style={styles.date}>
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                    </AppText>
                </View>
                <View style={styles.orderRight}>
                    <AppText style={styles.total}>{formatCurrency(item.total)}</AppText>
                    <View style={styles.statusBadge}>
                        <Ionicons name="checkmark-circle" size={12} color={GREEN} />
                        <AppText style={styles.statusText}>Pago</AppText>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <AppText variant="title" style={styles.header}>Meu Histórico</AppText>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <AppText style={styles.empty}>Nenhuma compra encontrada no histórico.</AppText>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: CREAM },
    header: { color: NAVY, padding: 16, marginTop: 10 },
    listContainer: { padding: 16 },
    orderCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardIndicator: { width: 6, backgroundColor: NAVY },
    orderContent: {
        flex: 1,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    orderId: { fontWeight: "700", color: NAVY },
    date: { fontSize: 12, marginTop: 4 },
    orderRight: { alignItems: "flex-end" },
    total: { fontWeight: "800", color: NAVY, fontSize: 16 },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
    },
    statusText: { fontSize: 10, color: GREEN, marginLeft: 4, fontWeight: "600" },
    empty: { textAlign: "center", marginTop: 50, color: "#666" }
});