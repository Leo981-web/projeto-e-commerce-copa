import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppText from "../../components/AppText";
import QuantityInput from "../../components/QuantityInput";
import ScreenHeader from "../../components/ScreenHeader";
import Loading from "../../components/Loading";
import {
  formatDecimalInput,
  parseCurrencyInput,
} from "../../services/formatters";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import * as productService from "../../services/productService";
import { useTheme } from "../../context/ThemeContext";

export default function ProductEditScreen({ navigation, route }) {
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const styles = makeStyles(theme);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      const data = await productService.getProductById(route.params.productId);
      setProduct(data);
      setName(data?.name ?? "");
      setDescription(data?.description ?? "");
      setPrice(data ? formatDecimalInput(data.price) : "");
      setQuantity(data ? String(data.quantity) : "");
      setImage(data?.image ?? "");
      setLoading(false);
    }

    loadProduct();
  }, [route.params.productId]);

  async function handleSubmit() {
    if (!product) {
      showAlert({
        title: t("productNotFoundTitle"),
        message: t("productNotFoundMessage"),
        type: "danger",
      });
      return;
    }

    if (!name || !description || !price || !quantity || !image) {
      showAlert({
        title: t("requiredFieldsTitle"),
        message: t("requiredFieldsMessage"),
        type: "warning",
      });
      return;
    }

    const parsedPrice = parseCurrencyInput(price);
    const parsedQuantity = Number(quantity);

    if (
      Number.isNaN(parsedPrice) ||
      Number.isNaN(parsedQuantity) ||
      !Number.isInteger(parsedQuantity) ||
      parsedPrice < 0 ||
      parsedQuantity < 0
    ) {
      showAlert({
        title: t("invalidDataTitle"),
        message: t("invalidDataMessage"),
        type: "danger",
      });
      return;
    }

    try {
      await productService.updateProduct(product.id, {
        name,
        description,
        price,
        quantity,
        image,
      });
      showAlert({
        title: t("productUpdatedTitle"),
        message: t("productUpdatedMessage"),
        type: "success",
        buttonText: t("backToListButton"),
        onClose: () => navigation.goBack(),
      });
    } catch (error) {
      showAlert({
        title: t("updateProductErrorTitle"),
        message: error.message,
        type: "danger",
      });
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title={t("editProductTitle")}
          onBack={() => navigation.goBack()}
        />
        <AppText variant="muted" style={styles.emptyText}>
          {t("productNotFound")}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t("editProductTitle")}
        onBack={() => navigation.goBack()}
      />

      <AppInput
        icon="inventory-2"
        label={t("nameLabel")}
        onChangeText={setName}
        placeholder={t("productNamePlaceholder")}
        value={name}
      />

      <AppInput
        icon="description"
        label={t("descriptionLabel")}
        multiline
        onChangeText={setDescription}
        placeholder={t("descriptionPlaceholder")}
        value={description}
      />

      <AppInput
        icon="payments"
        keyboardType="numeric"
        label={t("priceLabel")}
        onChangeText={setPrice}
        placeholder={t("pricePlaceholder")}
        value={price}
      />

      <QuantityInput onChangeText={setQuantity} value={quantity} />

      <AppInput
        autoCapitalize="none"
        icon="image"
        keyboardType="url"
        label={t("imageLabel")}
        onChangeText={setImage}
        placeholder={t("imagePlaceholder")}
        value={image}
      />

      <AppButton
        icon="check-circle"
        onPress={handleSubmit}
        style={styles.submitButton}
        title={t("updateProductButton")}
      />
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
    submitButton: {
      marginTop: 8,
    },
    emptyText: {
      marginTop: 24,
      textAlign: "center",
      color: theme.textMuted,
      fontSize: 16,
    },
  });
