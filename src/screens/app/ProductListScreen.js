import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
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
import { formatCurrency } from "../../services/formatters";
import * as productService from "../../services/productService";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoriteContext";

const { width } = Dimensions.get("window");


const COUNTRY_THEMES = [
  { bg: "#D4EDDA", accent: "#009C3B", flag: "🇧🇷" }, // Brasil
  { bg: "#D6E8F5", accent: "#74ACDF", flag: "🇦🇷" }, // Argentina
  { bg: "#DDEAF7", accent: "#002395", flag: "🇫🇷" }, // França
  { bg: "#E8E8E8", accent: "#333333", flag: "🇩🇪" }, // Alemanha
  { bg: "#D4EDDA", accent: "#006600", flag: "🇵🇹" }, // Portugal
  { bg: "#F7DADA", accent: "#AA151B", flag: "🇪🇸" }, // Espanha
];

const FILTER_KEYS = ["filterAll", "filterShirts", "filterShoes", "filterAccessories", "filterStickers"];

const NAV_ITEMS = [
  { key: "home",      icon: "home",           iconOff: "home-outline",        labelKey: "navHome"      },
  { key: "favorites", icon: "heart",          iconOff: "heart-outline",       labelKey: "navFavorites" },
  { key: "create",    icon: "add",            center: true                                             },
  { key: "cart",      icon: "cart",           iconOff: "cart-outline",        labelKey: "navCart"      },
  { key: "profile",   icon: "person",         iconOff: "person-outline",      labelKey: "navProfile"   },
];

export default function ProductListScreen({ navigation }) {
  const { logout, user } = useAuth();
  const { showAlert, showConfirm } = useCustomAlert();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { addToCart, totalItems, cart } = useCart(); 

  const styles = makeStyles(theme);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("filterAll"); 
  const [activeNav, setActiveNav] = useState("home");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      showAlert({ title: t("loadProductsErrorTitle"), message: error.message, type: "danger" });
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      setActiveNav("home");
    }, []),
  );

  // Filtra os produtos pelo termo digitado na barra de pesquisa (nome ou descrição)
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) => {
      const name = product.name?.toLowerCase() ?? "";
      const description = product.description?.toLowerCase() ?? "";
      return name.includes(term) || description.includes(term);
    });
  }, [products, search]);

  function confirmDelete(product) {
    showConfirm({
      title: t("deleteProductTitle"),
      message: `${t("deleteProductConfirm1")} ${product.name}? ${t("deleteProductConfirm2")}`,
      confirmText: t("deleteButton"),
      cancelText: t("cancel"),
      type: "danger",
      onConfirm: async () => {
        try {
          await productService.deleteProduct(product.id);
          loadProducts();
        } catch (error) {
          showAlert({ title: t("deleteErrorTitle"), message: error.message, type: "danger" });
        }
      },
    });
  }

  function renderEmptyList() {
    return (
      <View style={styles.emptyState}>
        <EmptyStateImage width={200} height={150} />
        <Text style={styles.emptyTitle}>{t("emptyProductsTitle")}</Text>
        <Text style={styles.emptyDesc}>{t("emptyProductsDesc")}</Text>
      </View>
    );
  }

  function renderProduct({ item, index }) {
    const countryTheme = COUNTRY_THEMES[index % COUNTRY_THEMES.length];
    const cartItem = cart.find(c => c.id === item.id);
    const quantityInCart = cartItem ? cartItem.cartQuantity : 0;
    const availableQuantity = item.quantity - quantityInCart;
    const isFavoriteProduct = isFavorite(item.id);

    return (
      <Pressable
        onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
        style={[styles.card, { borderLeftColor: countryTheme.accent, borderLeftWidth: 4 }]}
      >
        <View style={[styles.cardImageWrap, { backgroundColor: countryTheme.bg }]}>
          <Text style={styles.cardFlag}>{countryTheme.flag}</Text>
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
            <AppText style={[styles.productPrice, { color: countryTheme.accent }]}> 
              {formatCurrency(item.price)}
            </AppText>
          </View>

          <AppText numberOfLines={2} variant="muted" style={styles.productDescription}>
            {item.description}
          </AppText>

          <View style={styles.cardFooter}>
            <View style={[styles.quantityBadge, { backgroundColor: countryTheme.bg }]}>
              <MaterialIcons name="inventory-2" size={13} color={countryTheme.accent} />
              <Text style={[styles.productQuantity, { color: countryTheme.accent }]}> 
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
                style={[styles.iconButton, isFavoriteProduct && styles.favoriteIconButton]}
              >
                <MaterialIcons
                  name={isFavoriteProduct ? "favorite" : "favorite-border"}
                  size={18}
                  color={isFavoriteProduct ? "#009C3B" : theme.titlePrimary}
                />
              </Pressable>

              <Pressable
                hitSlop={8}
                onPress={(e) => { 
                  e.stopPropagation(); 
                  const wasAdded = addToCart({ ...item, stock: item.quantity });
                  if (!wasAdded) {
                    showAlert({ title: t("opsTitle"), message: t("stockLimitMessage"), type: "danger" });
                  }
                }}
                style={styles.iconButton}
              >
                <MaterialIcons name="add-shopping-cart" size={18} color={theme.titlePrimary} />
              </Pressable>

              <Pressable
                hitSlop={8}
                onPress={(e) => { e.stopPropagation(); navigation.navigate("ProductEdit", { productId: item.id }); }}
                style={styles.iconButton}
              >
                <MaterialIcons name="edit" size={18} color={theme.titlePrimary} />
              </Pressable>
              <Pressable
                hitSlop={8}
                onPress={(e) => { e.stopPropagation(); confirmDelete(item); }}
                style={[styles.iconButton, styles.deleteIconButton]}
              >
                <MaterialIcons name="delete-outline" size={19} color={theme.textDestructive} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t("hello")}, {user?.name} 👋</Text>
          <Text style={styles.headerTitle}>{t("logoTitle")}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate("Settings")} style={styles.settingsBtn}>
          <MaterialIcons name="settings" size={20} color={theme.titlePrimary} />
        </Pressable>
      </View>

      {/* BUSCA */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={theme.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchPlaceholder")}
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterIconBtn}>
          <MaterialIcons name="tune" size={20} color={theme.card} />
        </TouchableOpacity>
      </View>

      {/* CHAMADA */}
      <View style={styles.callout}>
        <Text style={styles.calloutText}>{t("callout1")} <Text style={styles.calloutGreen}>{t("calloutCopa")}</Text> {t("callout2")}</Text>
        <Text style={styles.calloutSub}>{t("calloutSub")}</Text>
      </View>

      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {FILTER_KEYS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
              {t(f)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTA DE PRODUTOS */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.navActive} size="large" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyList}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, tab.center && styles.navItemCenter]}
            onPress={() => {
              setActiveNav(tab.key);
              if (tab.key === "create") navigation.navigate("ProductCreate");
              if (tab.key === "profile") navigation.navigate("Profile");
              if (tab.key === "cart") navigation.navigate("Cart");
              if (tab.key === "favorites") navigation.navigate("Favorites");
            }}
          >
            {tab.center ? (
              <View style={styles.navCreateBtn}>
                <Ionicons name="add" size={28} color={theme.card} />
              </View>
            ) : (
              <>
                <View style={{ position: "relative" }}>
                  <Ionicons
                    name={activeNav === tab.key ? tab.icon : tab.iconOff}
                    size={22}
                    color={activeNav === tab.key ? theme.titlePrimary : theme.navInactive}
                  />

                  {/* Badge de Itens Globais do Carrinho */}
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
                {activeNav === tab.key && <View style={styles.navDot} />}
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
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 8,
    },
    greeting: {
      fontSize: 13,
      color: theme.textMuted,
      fontWeight: "500",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: theme.titlePrimary,
      letterSpacing: 3,
      marginTop: 2,
    },
    settingsBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.card,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 6,
      elevation: 2,
    },
    searchRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 10,
      marginBottom: 16,
    },
    searchBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 14,
      paddingHorizontal: 14,
      height: 46,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: theme.textPrimary,
    },
    filterIconBtn: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: theme.titlePrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    callout: {
      paddingHorizontal: 20,
      marginBottom: 14,
    },
    calloutText: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.titlePrimary,
    },
    calloutGreen: {
      color: "green",
    },
    calloutSub: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
    },
    filtersScroll: {
      maxHeight: 44,
      marginBottom: 14,
    },
    filtersRow: {
      paddingHorizontal: 20,
      gap: 8,
      alignItems: "center",
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: theme.card,
      borderWidth: 1.5,
      borderColor: theme.divider,
    },
    filterChipActive: {
      backgroundColor: theme.titlePrimary,
      borderColor: theme.titlePrimary,
    },
    filterChipText: {
      fontSize: 12,
      color: theme.textMuted,
      fontWeight: "600",
    },
    filterChipTextActive: {
      color: theme.card,
      fontWeight: "700",
    },
    list: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingBottom: 110,
      paddingTop: 4,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 90,
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
      width: 90,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      paddingVertical: 8,
    },
    cardFlag: {
      position: "absolute",
      top: 6,
      left: 6,
      fontSize: 14,
    },
    productImage: {
      width: 70,
      height: 80,
      borderRadius: 12,
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
    deleteIconButton: {
      backgroundColor: theme.iconDestructiveBg,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 60,
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
      maxWidth: 240,
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
    navItemCenter: {
      marginTop: -28,
    },
    navCreateBtn: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: theme.navActive,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.navActive,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 4,
      borderColor: theme.card,
    },
    navLabel: {
      fontSize: 10,
      color: theme.navInactive,
      fontWeight: "500",
    },
    navLabelActive: {
      color: theme.titlePrimary,
      fontWeight: "700",
    },
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
      borderColor: "#FFF", 
    },
    cartBadgeText: {
      color: "#FFF",
      fontSize: 9,
      fontWeight: "bold",
    },
  });