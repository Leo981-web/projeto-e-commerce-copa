import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import EmptyStateImage from "../../assets/empty_state.svg";
import AppText from "../../components/AppText";
import ProductImage from "../../components/ProductImage";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoriteContext";
import { formatCurrency } from "../../services/formatters";
import * as productService from "../../services/productService";
import Loading from "../../components/Loading";
import { getCountryTheme } from "../../utils/countryTheme";

function buildNavItems(isAdmin) {
  return [
    { key: "home", icon: "home", iconOff: "home-outline", labelKey: "navHome" },
    {
      key: "favorites",
      icon: "heart",
      iconOff: "heart-outline",
      labelKey: "navFavorites",
    },
    { key: "create", center: true, adminOnly: true },
    { key: "cart", icon: "cart", iconOff: "cart-outline", labelKey: "navCart" },
    {
      key: "profile",
      icon: "person",
      iconOff: "person-outline",
      labelKey: "navProfile",
    },
  ].filter((tab) => !tab.adminOnly || isAdmin);
}

export default function FavoriteScreen({ navigation }) {
  const { user, isAdmin } = useAuth();
  const { addToCart, cart, totalItems } = useCart();
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const styles = makeStyles(theme);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const [activeNav, setActiveNav] = useState("favorites");
  const NAV_ITEMS = buildNavItems(isAdmin);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      showAlert({
        title: t("loadProductsErrorTitle"),
        message: error.message,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [user?.id]),
  );

  function renderEmptyState() {
    return (
      <View style={styles.emptyState}>
        <EmptyStateImage width={200} height={150} />
        <Text style={styles.emptyTitle}>{t("noFavorites")}</Text>
        <Text style={styles.emptyDesc}>{t("heartSaveIt")}</Text>
      </View>
    );
  }

  function renderProduct({ item }) {
    const countryTheme = getCountryTheme(item);
    const cartItem = cart.find((c) => c.id === item.id);
    const quantityInCart = cartItem ? cartItem.cartQuantity : 0;
    const availableQuantity = item.quantity - quantityInCart;

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ProductDetails", { productId: item.id })
        }
        style={[
          styles.card,
          { borderLeftColor: countryTheme.accent, borderLeftWidth: 4 },
        ]}
      >
        <View
          style={[styles.cardImageWrap, { backgroundColor: countryTheme.bg }]}
        >
          {countryTheme.flag ? (
            <Text style={styles.cardFlag}>{countryTheme.flag}</Text>
          ) : null}
          <ProductImage
            name={item.name}
            sourceUrl={item.image}
            style={styles.productImage}
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <AppText numberOfLines={1} style={styles.productName}>
              {item.name}
            </AppText>
            <AppText style={[styles.productPrice, { color: theme.navActive }]}>
              {formatCurrency(item.price)}
            </AppText>
          </View>

          <AppText
            numberOfLines={2}
            variant="muted"
            style={styles.productDescription}
          >
            {item.description}
          </AppText>

          <View style={styles.cardFooter}>
            <View
              style={[
                styles.quantityBadge,
                { backgroundColor: countryTheme.bg },
              ]}
            >
              <MaterialIcons
                name="inventory-2"
                size={13}
                color={countryTheme.accent}
              />
              <Text
                style={[styles.productQuantity, { color: countryTheme.accent }]}
              >
                {availableQuantity} {t("inStock")}
              </Text>
            </View>

            <View style={styles.actions}>
              <Pressable
                hitSlop={8}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
                style={[styles.iconButton, styles.favoriteIconButton]}
              >
                <MaterialIcons name="favorite" size={18} color="#009C3B" />
              </Pressable>

              <Pressable
                hitSlop={8}
                onPress={(e) => {
                  e.stopPropagation();
                  const wasAdded = addToCart({ ...item, stock: item.quantity });
                  if (!wasAdded) {
                    showAlert({
                      title: t("opsTitle"),
                      message: t("stockLimitMessage"),
                      type: "danger",
                    });
                  }
                }}
                style={styles.iconButton}
              >
                <MaterialIcons
                  name="add-shopping-cart"
                  size={18}
                  color={theme.titlePrimary}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  const favoriteProducts = products.filter((product) => isFavorite(product.id));

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons
            name="arrow-back"
            size={20}
            color={theme.titlePrimary}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t("navFavorites")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("favoritesScreenSubTitle")}
          </Text>
        </View>
      </View>

      {favoriteProducts.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={favoriteProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* --- BARRA DE NAVEGAÇÃO --- */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, tab.center && styles.navItemCenter]}
            onPress={() => {
              setActiveNav(tab.key);
              if (tab.key === "home") navigation.navigate("Products");
              if (tab.key === "create") navigation.navigate("ProductCreate");
              if (tab.key === "profile") navigation.navigate("Profile");
              if (tab.key === "cart") navigation.navigate("Cart");
            }}
          >
            {tab.center ? (
              <View style={styles.navCreateBtn}>
                <Ionicons name="add" size={26} color="#85ec9c" />
              </View>
            ) : (
              <>
                <View
                  style={[
                    styles.navIconWrap,
                    activeNav === tab.key && styles.navIconWrapActive,
                    { position: "relative" },
                  ]}
                >
                  <Ionicons
                    name={activeNav === tab.key ? tab.icon : tab.iconOff}
                    size={20}
                    color={
                      activeNav === tab.key
                        ? theme.navActive
                        : theme.navInactive || "#999"
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
                    activeNav === tab.key && styles.navLabelActive,
                  ]}
                >
                  {t(tab.labelKey)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 10,
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.card,
      alignItems: "center",
      justifyContent: "center",
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.titlePrimary,
    },
    headerSubtitle: {
      fontSize: 13,
      color: theme.textMuted,
      marginTop: 2,
    },
    list: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 6,
      paddingBottom: 110,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      gap: 12,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.titlePrimary,
    },
    emptyDesc: {
      fontSize: 13,
      color: theme.textMuted,
      textAlign: "center",
      maxWidth: 260,
    },
    card: {
      flexDirection: "row",
      marginBottom: 12,
      borderRadius: 18,
      backgroundColor: theme.card,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    cardImageWrap: {
      width: 76,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      paddingVertical: 8,
    },
    cardFlag: {
      position: "absolute",
      top: 6,
      left: 6,
      fontSize: 15,
    },
    productImage: {
      width: 52,
      height: 64,
      borderRadius: 10,
      marginTop: 10,
    },
    cardContent: {
      flex: 1,
      padding: 12,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    productName: {
      flex: 1,
      fontSize: 15,
      fontWeight: "800",
      color: theme.textPrimary,
    },
    productPrice: {
      fontSize: 14,
      fontWeight: "800",
    },
    productDescription: {
      marginTop: 5,
      fontSize: 12,
      lineHeight: 18,
      color: theme.textMuted,
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
    },
    quantityBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 999,
    },
    productQuantity: {
      fontSize: 11,
      fontWeight: "700",
    },
    actions: {
      flexDirection: "row",
      gap: 6,
    },
    iconButton: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      backgroundColor: theme.iconBg,
    },
    favoriteIconButton: {
      backgroundColor: "#FFE8EE",
    },
    // --- ESTILOS DA BARRA DE NAVEGAÇÃO ADICIONADOS AQUI ---
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      backgroundColor: theme.surfaceAccent,
      paddingTop: 12,
      paddingBottom: 26,
      paddingHorizontal: 10,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderTopWidth: 1,
      borderColor: theme.divider || "#EEE",
    },
    navItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
    },
    navItemCenter: { marginTop: -16 },
    navIconWrap: {
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
      backgroundColor: "#F5C518",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: theme.surfaceAccent,
      shadowColor: "#F5C518",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 6,
    },
    navLabel: {
      fontSize: 10,
      color: theme.navInactive,
      fontWeight: "600",
    },
    navLabelActive: {
      color: theme.navActive,
      fontWeight: "800",
    },
    cartBadge: {
      position: "absolute",
      top: -6,
      right: -8,
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
