import { useCallback } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../services/formatters";
import AppText from "../../components/AppText";
import ProductImage from "../../components/ProductImage";

const GOLD = "#F5C518";

export default function CartScreen({ navigation }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    clearCart,
    totalItems,
  } = useCart();
  const { theme, isDarkMode } = useTheme();
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const NAV_ITEMS = [
    { key: "home",      icon: "home",   iconOff: "home-outline",   labelKey: "navHome"      },
    { key: "favorites", icon: "heart",  iconOff: "heart-outline",  labelKey: "navFavorites" },
    { key: "create",    center: true,                              adminOnly: true          },
    { key: "cart",      icon: "cart",   iconOff: "cart-outline",   labelKey: "navCart"      },
    { key: "profile",   icon: "person", iconOff: "person-outline", labelKey: "navProfile"   },
  ].filter((tab) => !tab.adminOnly || isAdmin);

  const styles = makeStyles(theme, isDarkMode);

  function handleCheckout() {
    if (cart.length === 0) {
      showAlert({
        title: t("attentionTitle") || "Atenção",
        message: t("cartEmpty") || "Seu carrinho está vazio.",
        type: "warning",
      });
      return;
    }
    navigation.navigate("Payment", {
      total: totalPrice,
    });
  }

  // Utilizando useCallback na mudança de quantidade
  const handleQuantityChange = useCallback((id, amount) => {
    const result = updateQuantity(id, amount);
    if (result === "max_reached") {
      showAlert({
        title: t("limitReachedTitle"),
        message: t("limitReachedMessage"),
        type: "neutral",
      });
    }
  }, [updateQuantity, showAlert, t]);

  // Utilizando useCallback na renderização do item
  const renderCartItem = useCallback(({ item }) => {
    return (
      <View style={styles.cartItem}>
        <ProductImage name={item.name} sourceUrl={item.image} style={styles.productImage} />

        <View style={styles.itemDetails}>
          <AppText style={styles.productName} numberOfLines={1}>
            {item.name}
          </AppText>
          <AppText style={styles.productPrice}>
            {formatCurrency(item.price)}
          </AppText>

          <View style={styles.itemBottomRow}>
            <View style={styles.quantityContainer}>
              <Pressable
                onPress={() => handleQuantityChange(item.id, -1)}
                style={styles.quantityButtonMinus}
              >
                <MaterialIcons name="remove" size={14} color={theme.titlePrimary} />
              </Pressable>
              <Text style={styles.quantityText}>{item.cartQuantity}</Text>
              <Pressable
                onPress={() => handleQuantityChange(item.id, 1)}
                style={styles.quantityButtonPlus}
              >
                <MaterialIcons name="add" size={14} color="#FFFFFF" />
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                removeFromCart(item.id);
                showAlert({
                  title: t("itemRemovedTitle"),
                  message: t("itemRemovedMessage"),
                  type: "neutral",
                });
              }}
              style={styles.removeButton}
              hitSlop={8}
            >
              <MaterialIcons
                name="delete-outline"
                size={18}
                color={theme.textDestructive || "#FF3B30"}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }, [styles, theme, t, handleQuantityChange, removeFromCart, showAlert]);

  return (
    <SafeAreaView style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons
            name="arrow-back"
            size={22}
            color={theme.titlePrimary}
          />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <AppText style={styles.headerTitle}>{t("cartTitle")}</AppText>
          {cart.length > 0 && (
            <AppText style={styles.headerSubtitle}>
              {totalItems} {t("cartItemsCount")}
            </AppText>
          )}
        </View>
      </View>

      {/* BANNER DE FRETE GRÁTIS */}
      {cart.length > 0 && (
        <View style={styles.shippingBanner}>
          <MaterialIcons name="local-shipping" size={16} color={theme.navActive} />
          <AppText style={styles.shippingBannerText}>
            {t("freeShippingBanner")}
          </AppText>
        </View>
      )}

      {/* LISTA DE ITENS */}
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={theme.textMuted} />
          <AppText style={styles.emptyText}>{t("cartEmpty")}</AppText>

          <Pressable
            style={styles.goToShopButton}
            onPress={() => navigation.navigate("Products")}
          >
            <Text style={styles.goToShopButtonText}>{t("goToShop")}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FOOTER - RESUMO DO PEDIDO */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <AppText style={styles.summaryTitle}>{t("orderSummaryTitle")}</AppText>

          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>{t("subtotalLabel")}</AppText>
            <AppText style={styles.summaryValue}>{formatCurrency(totalPrice)}</AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>{t("shippingLabel")}</AppText>
            <AppText style={styles.summaryValueFree}>{t("freeLabel")}</AppText>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <AppText style={styles.totalLabel}>{t("cartTotal")}</AppText>
            <AppText style={styles.totalValue}>
              {formatCurrency(totalPrice)}
            </AppText>
          </View>

          <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>{t("checkoutButton")}</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, tab.center && styles.navItemCenter]}
            onPress={() => {
              if (tab.key === "home")      navigation.navigate("Products");
              if (tab.key === "profile")   navigation.navigate("Profile");
              if (tab.key === "favorites") navigation.navigate("Favorites");
              if (tab.key === "create")    navigation.navigate("ProductCreate");
            }}
          >
            {tab.center ? (
              <View style={styles.navCreateBtn}>
                <Ionicons name="add" size={26} color="#15622A" />
              </View>
            ) : (
              <>
                <View style={[styles.navIconWrap, tab.key === "cart" && styles.navIconWrapActive]}>
                  <Ionicons
                    name={tab.key === "cart" ? tab.icon : tab.iconOff}
                    size={22}
                    color={tab.key === "cart" ? theme.navActive : theme.navInactive}
                  />
                  {tab.key === "cart" && totalItems > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{totalItems}</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.navLabel,
                    tab.key === "cart" && styles.navLabelActive,
                  ]}
                >
                  {t(tab.labelKey)}
                </Text>
                {tab.key === "cart" && <View style={styles.navDot} />}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (theme, isDarkMode) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      paddingBottom: 12,
      gap: 12,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.card,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTextWrap: { flex: 1 },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.titlePrimary,
    },
    headerSubtitle: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
      fontWeight: "600",
    },
    shippingBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginHorizontal: 16,
      marginBottom: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.iconBg,
    },
    shippingBannerText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.navActive,
    },
    listContainer: { paddingHorizontal: 16, paddingBottom: 320 },
    cartItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    productImage: { width: 64, height: 64, borderRadius: 12 },
    itemDetails: { flex: 1, marginLeft: 12 },
    productName: { fontSize: 14, fontWeight: "700", color: theme.titlePrimary },
    productPrice: { fontSize: 14, fontWeight: "800", color: theme.navActive, marginTop: 3 },
    itemBottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    quantityButtonMinus: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1.3,
      borderColor: theme.divider,
      justifyContent: "center",
      alignItems: "center",
    },
    quantityButtonPlus: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: theme.navActive,
      justifyContent: "center",
      alignItems: "center",
    },
    quantityText: {
      width: 30,
      textAlign: "center",
      fontSize: 13,
      fontWeight: "800",
      color: theme.titlePrimary,
    },
    removeButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.iconDestructiveBg,
    },
    footer: {
      position: "absolute",
      bottom: 88,
      left: 0,
      right: 0,
      backgroundColor: theme.card,
      padding: 18,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 10,
    },
    summaryTitle: {
      fontSize: 12,
      fontWeight: "800",
      color: theme.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    summaryLabel: { fontSize: 13, color: theme.textMuted },
    summaryValue: { fontSize: 13, fontWeight: "700", color: theme.titlePrimary },
    summaryValueFree: { fontSize: 13, fontWeight: "800", color: theme.navActive },
    summaryDivider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: 10,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    totalLabel: { fontSize: 15, fontWeight: "700", color: theme.titlePrimary },
    totalValue: { fontSize: 21, fontWeight: "900", color: theme.navActive },
    checkoutButton: {
      flexDirection: "row",
      gap: 8,
      backgroundColor: isDarkMode ? "#00B047" : "#15622A",
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    checkoutButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
    goToShopButton: {
      backgroundColor: theme.titlePrimary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    goToShopButtonText: {
      color: isDarkMode ? "#121214" : "#FFF",
      fontSize: 15,
      fontWeight: "bold",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 32,
      paddingBottom: 100,
    },
    emptyText: {
      fontSize: 17,
      color: theme.textMuted,
      marginTop: 16,
      marginBottom: 20,
      textAlign: "center",
    },
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      backgroundColor: theme.surfaceAccent,
      paddingTop: 10,
      paddingBottom: 24,
      paddingHorizontal: 10,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 10,
    },
    navItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    },
    navItemCenter: { marginTop: -16 },
    navIconWrap: {
      position: "relative",
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    navIconWrapActive: {
      backgroundColor: theme.iconBg,
    },
    navCreateBtn: {
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: GOLD,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: theme.surfaceAccent,
      shadowColor: GOLD,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 6,
    },
    navLabel: { fontSize: 10, color: theme.navInactive, fontWeight: "500" },
    navLabelActive: { color: theme.navActive, fontWeight: "700" },
    navDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.navActive,
    },
    cartBadge: {
      position: "absolute",
      top: -6,
      right: -10,
      backgroundColor: "#FF3B30",
      borderRadius: 10,
      minWidth: 16,
      height: 16,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
      borderWidth: 1.5,
      borderColor: theme.card,
    },
    cartBadgeText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  });