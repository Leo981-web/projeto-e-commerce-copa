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

const COUNTRY_THEMES = [
  { bg: "#D4EDDA", accent: "#009C3B", flag: "🇧🇷" },
  { bg: "#D6E8F5", accent: "#74ACDF", flag: "🇦🇷" },
  { bg: "#DDEAF7", accent: "#002395", flag: "🇫🇷" },
  { bg: "#E8E8E8", accent: "#333333", flag: "🇩🇪" },
  { bg: "#D4EDDA", accent: "#006600", flag: "🇵🇹" },
  { bg: "#F7DADA", accent: "#AA151B", flag: "🇪🇸" },
];

export default function FavoriteScreen({ navigation }) {
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const styles = makeStyles(theme);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
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
    }, [user?.id]),
  );

  function renderEmptyState() {
    return (
      <View style={styles.emptyState}>
        <EmptyStateImage width={200} height={150} />
        <Text style={styles.emptyTitle}>{t("noFavorites")}</Text>
        <Text style={styles.emptyDesc}>
          {t("heartSaveIt")}
        </Text>
      </View>
    );
  }

  function renderProduct({ item, index }) {
    const countryTheme = COUNTRY_THEMES[index % COUNTRY_THEMES.length];
    const cartItem = cart.find((c) => c.id === item.id);
    const quantityInCart = cartItem ? cartItem.cartQuantity : 0;
    const availableQuantity = item.quantity - quantityInCart;

    return (
      <Pressable
        onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
        style={[styles.card, { borderLeftColor: countryTheme.accent, borderLeftWidth: 4 }]}
      >
        <View style={[styles.cardImageWrap, { backgroundColor: countryTheme.bg }]}> 
          <Text style={styles.cardFlag}>{countryTheme.flag}</Text>
          <ProductImage name={item.name} sourceUrl={item.image} style={styles.productImage} />
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
                {availableQuantity} in stock
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
                    showAlert({ title: t("opsTitle"), message: t("stockLimitMessage"), type: "danger" });
                  }
                }}
                style={styles.iconButton}
              >
                <MaterialIcons name="add-shopping-cart" size={18} color={theme.titlePrimary} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  const favoriteProducts = products.filter((product) => isFavorite(product.id));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color={theme.titlePrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t("navFavorites")}</Text>
          <Text style={styles.headerSubtitle}>{t("favoritesScreenSubTitle")}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.navActive} size="large" />
        </View>
      ) : favoriteProducts.length === 0 ? (
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
      paddingBottom: 24,
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
  });
