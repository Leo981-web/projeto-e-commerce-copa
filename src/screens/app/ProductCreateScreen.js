import { useState } from "react";
import { StyleSheet, View } from "react-native";

import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import QuantityInput from "../../components/QuantityInput";
import ScreenHeader from "../../components/ScreenHeader";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext"; 
import { parseCurrencyInput } from "../../services/formatters";
import * as productService from "../../services/productService";

export default function ProductCreateScreen({ navigation }) {
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage(); 

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");

  const { user } = useAuth(); 

  async function handleSubmit() {
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
        title: t("invalidValuesTitle"),
        message: t("invalidValuesMessage"),
        type: "warning",
      });
      return;
    }

    try {
      
      await productService.createProduct(
        {
          name,
          description,
          price: parsedPrice,
          quantity: parsedQuantity,
          image,
        },
        user.id 
      );

      showAlert({
        title: t("productCreatedTitle") || "Produto cadastrado",
        message: t("productCreatedMessage") || "O produto foi salvo com sucesso.",
        type: "success",
        buttonText: t("backToListButton") || "Voltar para a lista",
        onClose: () => navigation.goBack(),
      });
    } catch (error) {
      showAlert({
        title: t("createProductErrorTitle"),
        message: error.message,
        type: "danger",
      });
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title={t("newProduct")} onBack={() => navigation.goBack()} />

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
        icon="save"
        onPress={handleSubmit}
        style={styles.submitButton}
        title={t("saveProduct")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F1E8", // CREAM
  },
  submitButton: {
    marginTop: 20,
  },
});