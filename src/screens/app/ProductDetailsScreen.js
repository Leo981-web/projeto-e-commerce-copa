import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import AppButton from "../../components/AppButton";
import ProductImage from "../../components/ProductImage";
import ScreenHeader from "../../components/ScreenHeader";
import AppText from "../../components/AppText";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext"; 
import { formatCurrency } from "../../services/formatters";
import * as productService from "../../services/productService";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetailsScreen({ navigation, route }) {
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { isAdmin } = useAuth(); 
  const styles = makeStyles(theme);

  async function loadProduct() {
    try {
      setLoading(true);
      const data = await productService.getProductById(route.params.productId);
      setProduct(data);
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
        <AppText>{t("loading")}</AppText>
      </View>
    );
  }

  if (!product) {
    return null; // O ecrã vai ficar em branco momentaneamente se o produto não for encontrado
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t("productDetailsTitle")} 
        onBack={() => navigation.goBack()}
      />

      <View style={styles.card}>
        <ProductImage
          name={product.name}
          sourceUrl={product.image}
          style={styles.image}
        />
        <AppText style={styles.name} variant="title">
          {product.name}
        </AppText>
        <AppText style={styles.description}>{product.description}</AppText>

        <View style={styles.row}>
          <View style={styles.iconAndLabel}>
            <MaterialIcons color={theme.textMuted} name="payments" size={20} />
            <AppText style={styles.label} variant="muted">
              {t("priceLabel")} 
            </AppText>
          </View>
          <AppText style={styles.value} variant="title">
            {formatCurrency(product.price)}
          </AppText>
        </View>

        <View style={styles.row}>
          <View style={styles.iconAndLabel}>
            <MaterialIcons color={theme.textMuted} name="inventory-2" size={20} />
            <AppText style={styles.label} variant="muted">
              {t("quantityLabel")} 
            </AppText>
          </View>
          <AppText style={styles.value}>{product.quantity}</AppText>
        </View>
      </View>

      {isAdmin && (
      <AppButton
        icon="edit"
        onPress={() =>
          navigation.navigate("ProductEdit", { productId: product.id })
        }
        style={styles.primaryButton}
        title={t("editProductButton")} 
      />
      )}
    </View>

  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 18,
      paddingTop: 58,
      backgroundColor: theme.bg,
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      padding: 14,
      borderRadius: 20,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    image: {
      width: "100%",
      height: 230,
      marginBottom: 16,
      borderRadius: 16,
      backgroundColor: theme.divider,
    },
    name: {
      fontSize: 26,
      color: theme.titlePrimary,
    },
    description: {
      marginTop: 10,
      marginBottom: 18,
      color: theme.textMuted,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    iconAndLabel: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    label: {
      fontSize: 14,
      color: theme.textMuted,
    },
    value: {
      fontSize: 16,
      color: theme.textPrimary,
    },
    primaryButton: {
      marginTop: 20,
    },
  });