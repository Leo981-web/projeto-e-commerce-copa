import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import AppButton from "../../components/AppButton";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { parseCurrencyInput } from "../../services/formatters";
import * as productService from "../../services/productService";
import { useTheme } from "../../context/ThemeContext";

export default function ProductCreateScreen({ navigation }) {
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage(); 
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");

  const { user } = useAuth();

  function getQuantityValue(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue < 0) {
      return 0;
    }

    return Math.floor(numericValue);
  }

  function handleQuantityChange(text) {
    const onlyNumbers = text.replace(/\D/g, "");
    setQuantity(onlyNumbers);
  }

  function incrementQuantity() {
    const nextValue = getQuantityValue(quantity) + 1;
    setQuantity(String(nextValue));
  }

  function decrementQuantity() {
    const nextValue = Math.max(getQuantityValue(quantity) - 1, 0);
    setQuantity(String(nextValue));
  }

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
      const targetUserId = (!user || user.id === "2") 
        ? "06c92c7a-10cd-4480-84fa-bd8ab05434e2" 
        : user.id;

      await productService.createProduct(
        {
          name,
          description,
          price: parsedPrice,
          quantity: parsedQuantity,
          image,
        },
        targetUserId 
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
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.card }]}
        >
          <MaterialIcons name="arrow-back" size={22} color={theme.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>{t("newProduct")}</Text>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{t("nameLabel")}</Text>
        <View style={[styles.inputBox, { backgroundColor: theme.card, borderColor: theme.divider }]}> 
          <MaterialIcons
            name="inventory-2"
            size={21}
            color={theme.textMuted}
            style={styles.icon}
          />
          <TextInput
            placeholder={t("productNamePlaceholder")}
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.textPrimary }]}
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{t("descriptionLabel")}</Text>
        <View style={[styles.inputBox, styles.textArea, { backgroundColor: theme.card, borderColor: theme.divider }]}> 
          <MaterialIcons
            name="description"
            size={21}
            color={theme.textMuted}
            style={[styles.icon, styles.textAreaIcon]}
          />
          <TextInput
            multiline
            placeholder={t("descriptionPlaceholder")}
            placeholderTextColor={theme.textMuted}
            style={[styles.input, styles.textAreaInput, { color: theme.textPrimary }]}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{t("priceLabel")}</Text>
        <View style={[styles.inputBox, { backgroundColor: theme.card, borderColor: theme.divider }]}> 
          <MaterialIcons
            name="payments"
            size={21}
            color={theme.textMuted}
            style={styles.icon}
          />
          <TextInput
            keyboardType="numeric"
            placeholder={t("pricePlaceholder")}
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.textPrimary }]}
            value={price}
            onChangeText={setPrice}
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Quantidade</Text>
        <View style={[styles.inputBox, { backgroundColor: theme.card, borderColor: theme.divider }]}> 
          <MaterialIcons
            name="inventory-2"
            size={21}
            color={theme.textMuted}
            style={styles.icon}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.textPrimary }]}
            value={quantity}
            onChangeText={handleQuantityChange}
          />
          <View style={styles.quantityActions}>
            <Pressable
              disabled={getQuantityValue(quantity) === 0}
              hitSlop={8}
              onPress={decrementQuantity}
              style={({ pressed }) => [
                styles.quantityButton,
                { backgroundColor: theme.iconBg, opacity: pressed ? 0.7 : 1 },
                getQuantityValue(quantity) === 0 && styles.disabledButton,
              ]}
            >
              <MaterialIcons name="remove" size={19} color={theme.textPrimary} />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={incrementQuantity}
              style={({ pressed }) => [
                styles.quantityButton,
                { backgroundColor: theme.iconBg, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <MaterialIcons name="add" size={19} color={theme.textPrimary} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{t("imageLabel")}</Text>
        <View style={[styles.inputBox, { backgroundColor: theme.card, borderColor: theme.divider }]}> 
          <MaterialIcons
            name="image"
            size={21}
            color={theme.textMuted}
            style={styles.icon}
          />
          <TextInput
            autoCapitalize="none"
            keyboardType="url"
            placeholder={t("imagePlaceholder")}
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.textPrimary }]}
            value={image}
            onChangeText={setImage}
          />
        </View>
      </View>

      <AppButton
        icon="save"
        iconColor={theme.bg}
        onPress={handleSubmit}
        style={[styles.submitButton, { backgroundColor: theme.navActive }]}
        textStyle={{ color: theme.bg }}
        title={t("saveProduct")}
      />
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.bg,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.titlePrimary,
      flexShrink: 1,
    },
    inputWrapper: {
      marginBottom: 18,
    },
    label: {
      marginBottom: 7,
      fontSize: 14,
      fontWeight: "700",
      color: theme.textPrimary,
    },
    inputBox: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 14,
      minHeight: 50,
      paddingHorizontal: 14,
    },
    icon: {
      marginRight: 9,
    },
    input: {
      flex: 1,
      minHeight: 48,
      paddingVertical: 10,
      fontSize: 16,
    },
    textArea: {
      minHeight: 110,
      alignItems: "flex-start",
    },
    textAreaIcon: {
      marginTop: 14,
    },
    textAreaInput: {
      minHeight: 90,
      paddingTop: 14,
    },
    quantityActions: {
      flexDirection: "row",
      marginLeft: 12,
    },
    quantityButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 6,
    },
    disabledButton: {
      opacity: 0.45,
    },
    submitButton: {
      marginTop: 20,
    },
  });