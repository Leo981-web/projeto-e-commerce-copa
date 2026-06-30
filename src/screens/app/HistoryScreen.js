import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "../../components/AppText";
import { formatCurrency } from "../../services/formatters";
import { useHistory } from "../../context/HistoryContext";
import { getOrders } from "../../services/orderService";
import Loading from "../../components/Loading";
import { useTheme } from "../../context/ThemeContext";

const PAYMENT_LABELS = {
  pix: "Pix",
  card: "Cartão de Crédito",
  boleto: "Boleto",
};

function getPaymentLabel(method) {
  return PAYMENT_LABELS[method] || method || "Pagamento";
}

export default function HistoryScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const styles = makeStyles(theme, isDarkMode);

  const { history: localHistory } = useHistory();
  const [apiOrders, setApiOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const orders = await getOrders("BRL");
      setApiOrders(orders);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function onRefresh() {
    setRefreshing(true);
    fetchOrders();
  }

  const combinedOrders =
    apiOrders.length > 0
      ? apiOrders.map((apiOrder) => {
          const local = localHistory.find((h) => h.id === apiOrder.id);
          return {
            ...apiOrder,
            paymentMethod: apiOrder.paymentMethod || local?.paymentMethod,
          };
        })
      : localHistory;

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardIndicator} />
      <View style={styles.orderBody}>
        <View style={styles.orderHeader}>
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
              <Ionicons
                name="checkmark-circle"
                size={12}
                color={theme.navActive}
              />
              <AppText style={styles.statusText}>Pago</AppText>
            </View>
          </View>
        </View>

        <View style={styles.paymentRow}>
          <Ionicons name="wallet-outline" size={14} color={theme.textMuted} />
          <AppText style={styles.paymentText}>
            {getPaymentLabel(item.paymentMethod)}
          </AppText>
        </View>

        {(item.items || []).length > 0 && (
          <View style={styles.itemsSection}>
            <View style={styles.itemsDivider} />
            {(item.items || []).map((prod, index) => (
              <View
                key={prod.id ?? index}
                style={[
                  styles.itemRow,
                  index === (item.items || []).length - 1 && styles.itemRowLast,
                ]}
              >
                <View style={styles.itemInfo}>
                  <AppText numberOfLines={1} style={styles.itemName}>
                    {prod.name}
                  </AppText>
                  <AppText variant="muted" style={styles.itemQty}>
                    {prod.cartQuantity || 1} x {formatCurrency(prod.price)}
                  </AppText>
                </View>
                <AppText style={styles.itemSubtotal}>
                  {formatCurrency(prod.price * (prod.cartQuantity || 1))}
                </AppText>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppText variant="title" style={styles.header}>
        Meu Histórico
      </AppText>
      <FlatList
        data={combinedOrders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.navActive]}
            tintColor={theme.navActive}
          />
        }
        ListEmptyComponent={
          <AppText style={styles.empty}>
            Nenhuma compra encontrada no histórico.
          </AppText>
        }
      />
    </SafeAreaView>
  );
}

const makeStyles = (theme, isDarkMode) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.bg },
    header: { color: theme.titlePrimary, padding: 16, marginTop: 10 },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContainer: { padding: 16 },
    orderCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 12,
      flexDirection: "row",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.25 : 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    cardIndicator: { width: 6, backgroundColor: theme.navActive },
    orderBody: { flex: 1, padding: 16 },
    orderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    orderId: { fontWeight: "700", color: theme.titlePrimary },
    date: { fontSize: 12, marginTop: 4, color: theme.textMuted },
    orderRight: { alignItems: "flex-end" },
    total: { fontWeight: "800", color: theme.titlePrimary, fontSize: 16 },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.iconBg,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      marginTop: 4,
    },
    statusText: {
      fontSize: 10,
      color: theme.navActive,
      marginLeft: 4,
      fontWeight: "600",
    },
    paymentRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 10,
    },
    paymentText: { fontSize: 13, color: theme.textMuted },
    itemsSection: { marginTop: 4 },
    itemsDivider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: 10,
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    itemRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
    itemInfo: { flex: 1, marginRight: 12 },
    itemName: { fontWeight: "600", color: theme.titlePrimary, fontSize: 13 },
    itemQty: { fontSize: 12, marginTop: 2, color: theme.textMuted },
    itemSubtotal: {
      fontWeight: "700",
      color: theme.titlePrimary,
      fontSize: 13,
    },
    empty: { textAlign: "center", marginTop: 50, color: theme.textMuted },
  });
