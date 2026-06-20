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
import { formatCurrency } from "../../services/formatters";
import AppText from "../../components/AppText";
import ProductImage from "../../components/ProductImage";

const NAV_ITEMS = [
  { key: "home", icon: "home", iconOff: "home-outline", labelKey: "navHome" },
  {
    key: "favorites",
    icon: "heart",
    iconOff: "heart-outline",
    labelKey: "navFavorites",
  },
  { key: "create", icon: "add", center: true },
  { key: "cart", icon: "cart", iconOff: "cart-outline", labelKey: "navCart" },
  {
    key: "profile",
    icon: "person",
    iconOff: "person-outline",
    labelKey: "navProfile",
  },
];

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
      total: totalPrice
    });
  }

  function handleQuantityChange(id, amount) {
    const result = updateQuantity(id, amount);
    if (result === "max_reached") {
      showAlert({
        title: t("limitReachedTitle"),
        message: t("limitReachedMessage"),
        type: "neutral",
      });
    }
  }

  function renderCartItem({ item }) {
    return (
      <View style={styles.cartItem}>
        <ProductImage uri={item.imageUrl} style={styles.productImage} />

        <View style={styles.itemDetails}>
          <AppText style={styles.productName} numberOfLines={1}>
            {item.name}
          </AppText>
          <AppText style={styles.productPrice}>
            {formatCurrency(item.price)}
          </AppText>
        </View>

        <View style={styles.quantityContainer}>
          <Pressable
            onPress={() => handleQuantityChange(item.id, -1)}
            style={styles.quantityButton}
          >
            <MaterialIcons name="remove" size={16} color={theme.titlePrimary} />
          </Pressable>
          <Text style={styles.quantityText}>{item.cartQuantity}</Text>
          <Pressable
            onPress={() => handleQuantityChange(item.id, 1)}
            style={styles.quantityButton}
          >
            <MaterialIcons name="add" size={16} color={theme.titlePrimary} />
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
        >
          <MaterialIcons
            name="delete-outline"
            size={22}
            color={theme.textDestructive || "#FF3B30"}
          />
        </Pressable>
      </View>
    );
  }

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
            size={24}
            color={theme.titlePrimary}
          />
        </Pressable>
        <AppText style={styles.headerTitle}>{t("cartTitle")}</AppText>
      </View>

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
        />
      )}

      {/* FOOTER - FINALIZAR COMPRA */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <AppText style={styles.totalLabel}>{t("cartTotal")}</AppText>
            <AppText style={styles.totalValue}>
              {formatCurrency(totalPrice)}
            </AppText>
          </View>

          <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>{t("checkoutButton")}</Text>
          </Pressable>
        </View>
      )}

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.filter((tab) => !tab.center).map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => {
              if (tab.key === "home") navigation.navigate("Products");
              if (tab.key === "profile") navigation.navigate("Profile");
            }}
          >
            <View style={{ position: "relative" }}>
              <Ionicons
                name={tab.key === "cart" ? tab.icon : tab.iconOff}
                size={22}
                color={
                  tab.key === "cart" ? theme.titlePrimary : theme.navInactive
                }
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
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    backButton: { marginRight: 12, padding: 4 },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.titlePrimary,
    },
    listContainer: { padding: 16, paddingBottom: 220 },
    cartItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },
    productImage: { width: 60, height: 60, borderRadius: 8 },
    itemDetails: { flex: 1, marginLeft: 12, marginRight: 8 },
    productName: { fontSize: 15, fontWeight: "600", color: theme.titlePrimary },
    productPrice: { fontSize: 14, color: theme.textMuted, marginTop: 4 },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.bg,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    quantityButton: {
      padding: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    quantityText: {
      paddingHorizontal: 8,
      fontSize: 14,
      fontWeight: "bold",
      color: theme.titlePrimary,
    },
    removeButton: { marginLeft: 12, padding: 4 },
    footer: {
      position: "absolute",
      bottom: 74,
      left: 0,
      right: 0,
      backgroundColor: theme.card,
      padding: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 8,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    totalLabel: { fontSize: 16, color: theme.textMuted },
    totalValue: { fontSize: 20, fontWeight: "bold", color: theme.titlePrimary },
    checkoutButton: {
      backgroundColor: isDarkMode ? "#00B047" : "#009C3B",
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    checkoutButtonText: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
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
      backgroundColor: theme.card,
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
    navLabel: { fontSize: 10, color: theme.navInactive, fontWeight: "500" },
    navLabelActive: { color: theme.titlePrimary, fontWeight: "700" },
    navDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.titlePrimary,
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
      borderColor: isDarkMode ? "#1A1A1E" : "#FFF",
    },
    cartBadgeText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  });
