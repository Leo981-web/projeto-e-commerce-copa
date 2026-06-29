import { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import AppButton from "../../components/AppButton";
import ProductImage from "../../components/ProductImage";
import AppText from "../../components/AppText";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import { formatCurrency } from "../../services/formatters";
import * as productService from "../../services/productService";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoriteContext";
import Loading from "../../components/Loading";

const GREEN = "#15622A";

export default function ProductDetailsScreen({ navigation, route }) {
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const styles = makeStyles(theme);

  async function loadProduct() {
    try {
      setLoading(true);
      const data = await productService.getProductById(route.params.productId);
      setProduct(data);
      setQty(1);
    } catch (error) {
      showAlert({
        title: t("loadProductErrorTitle"),
        message: error.message,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadProduct();
    }, [route.params.productId]),
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Loading />
        <AppText>{t("loading")}</AppText>
      </View>
    );
  }

  if (!product) {
    return null; // O ecrã vai ficar em branco momentaneamente se o produto não for encontrado
  }

  const fav = isFavorite(product.id);

  function handleAddToCart() {
    let added = true;
    for (let i = 0; i < qty; i++) {
      added = addToCart({ ...product, stock: product.quantity });
      if (!added) break;
    }
    if (!added) {
      showAlert({
        title: t("opsTitle"),
        message: t("stockLimitMessage"),
        type: "danger",
      });
      return;
    }
    showAlert({
      title: t("itemAddedTitle"),
      message: t("itemAddedMessage"),
      type: "success",
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ── IMAGEM EM DESTAQUE ──────────────────────────────────────────── */}
        <View style={styles.heroWrap}>
          <ProductImage
            name={product.name}
            sourceUrl={product.image}
            style={styles.heroImage}
          />

          <Pressable
            style={[styles.floatingBtn, styles.floatingBtnLeft]}
            onPress={() => navigation.goBack()}
            hitSlop={10}
          >
            <MaterialIcons name="arrow-back" size={20} color={theme.titlePrimary} />
          </Pressable>

          <Pressable
            style={[styles.floatingBtn, styles.floatingBtnRight]}
            onPress={() => toggleFavorite(product)}
            hitSlop={10}
          >
            <MaterialIcons
              name={fav ? "favorite" : "favorite-border"}
              size={20}
              color={fav ? "#FF3B6F" : theme.titlePrimary}
            />
          </Pressable>
        </View>

        {/* ── FICHA DO PRODUTO ──────────────────────────────────────────────── */}
        <View style={styles.sheet}>
          <View style={styles.tagRow}>
            <View style={styles.tagChip}>
              <MaterialIcons name="verified" size={12} color={GREEN} />
              <AppText style={styles.tagChipText}>
                {t("officialProductTag")}
              </AppText>
            </View>
          </View>

          <AppText style={styles.name}>{product.name}</AppText>

          <View style={styles.priceRow}>
            <AppText style={styles.price}>{formatCurrency(product.price)}</AppText>
            <View
              style={[
                styles.stockBadge,
                { backgroundColor: product.quantity > 0 ? theme.iconBg : theme.iconDestructiveBg },
              ]}
            >
              <MaterialIcons
                name="inventory-2"
                size={13}
                color={product.quantity > 0 ? GREEN : theme.textDestructive}
              />
              <AppText
                style={[
                  styles.stockBadgeText,
                  { color: product.quantity > 0 ? GREEN : theme.textDestructive },
                ]}
              >
                {product.quantity > 0
                  ? `${product.quantity} ${t("inStock")}`
                  : t("outOfStock")}
              </AppText>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider }]}>
            <AppText style={[styles.cardLabel, { color: theme.textMuted }]}>
              {t("aboutProductLabel")}
            </AppText>
            <AppText style={[styles.description, { color: theme.textPrimary }]}>
              {product.description}
            </AppText>
          </View>

          {!isAdmin && (
            <View style={styles.qtyRow}>
              <AppText style={[styles.qtyLabel, { color: theme.textMuted }]}>
                {t("quantityLabel")}
              </AppText>
              <View style={[styles.qtyStepper, { borderColor: theme.divider }]}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty((q) => Math.max(1, q - 1))}
                  hitSlop={8}
                >
                  <MaterialIcons name="remove" size={16} color={theme.titlePrimary} />
                </TouchableOpacity>
                <AppText style={[styles.qtyValue, { color: theme.titlePrimary }]}>{qty}</AppText>
                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyBtnAdd]}
                  onPress={() => setQty((q) => Math.min(product.quantity || 99, q + 1))}
                  hitSlop={8}
                >
                  <MaterialIcons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isAdmin ? (
            <AppButton
              icon="edit"
              onPress={() =>
                navigation.navigate("ProductEdit", { productId: product.id })
              }
              style={[styles.primaryButton, { backgroundColor: GREEN }]}
              title={t("editProductButton")}
            />
          ) : (
            <AppButton
              icon="add-shopping-cart"
              disabled={product.quantity <= 0}
              onPress={handleAddToCart}
              style={[styles.primaryButton, { backgroundColor: GREEN }]}
              title={t("addToCartButton")}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    heroWrap: {
      width: "100%",
      height: 340,
      position: "relative",
    },
    heroImage: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.divider,
    },
    floatingBtn: {
      position: "absolute",
      top: 18,
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "rgba(255,255,255,0.92)",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    floatingBtnLeft: { left: 18 },
    floatingBtnRight: { right: 18 },
    sheet: {
      marginTop: -24,
      backgroundColor: theme.bg,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 22,
      paddingBottom: 36,
    },
    tagRow: { flexDirection: "row", marginBottom: 10 },
    tagChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "rgba(21,98,42,0.1)",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
    },
    tagChipText: {
      fontSize: 10,
      fontWeight: "800",
      color: GREEN,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    name: {
      fontSize: 24,
      fontWeight: "900",
      color: theme.titlePrimary,
      marginBottom: 12,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
    },
    price: { fontSize: 26, fontWeight: "900", color: theme.titlePrimary },
    stockBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    stockBadgeText: { fontSize: 11, fontWeight: "800" },
    card: {
      padding: 16,
      borderRadius: 18,
      borderWidth: 1.5,
      marginBottom: 20,
    },
    cardLabel: {
      fontSize: 11,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 8,
    },
    description: { fontSize: 14, lineHeight: 21 },
    qtyRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 22,
    },
    qtyLabel: { fontSize: 13, fontWeight: "700" },
    qtyStepper: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      borderWidth: 1.5,
      overflow: "hidden",
    },
    qtyBtn: {
      width: 38,
      height: 38,
      alignItems: "center",
      justifyContent: "center",
    },
    qtyBtnAdd: { backgroundColor: GREEN },
    qtyValue: {
      width: 36,
      textAlign: "center",
      fontSize: 15,
      fontWeight: "800",
    },
    primaryButton: {
      marginTop: 4,
    },
  });
