import { useState } from "react";
import {
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppButton from "../../components/AppButton";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { parseCurrencyInput } from "../../services/formatters";
import * as productService from "../../services/productService";
import { useTheme } from "../../context/ThemeContext";

// ── Paleta Copa ───────────────────────────────────────────────────────────
const GREEN = "#15622A";
const GREEN_DARK = "#0D4A1A";
const GREEN_MID = "#22C55E";
const GOLD = "#F5C518";

const getCategories = (t) => [
  t("Category1"),
  t("Category2"),
  t("Category3"),
  t("Category4"),
  t("Category5"),
];

const getTeams = (t) => [
  { code: "BR", name: t("teamBrasil") },
  { code: "AR", name: t("teamArgentina") },
  { code: "EN", name: t("teamInglaterra") },
  { code: "DE", name: t("teamAlemanha") },
  { code: "FR", name: t("teamFranca") },
  { code: "PT", name: t("teamPortugal") },
];

const getMoreTeams = (t) => [
  { code: "ES", name: t("teamEspanha") },
  { code: "IT", name: t("teamItalia") },
  { code: "NL", name: t("teamHolanda") },
  { code: "UY", name: t("teamUruguai") },
  { code: "MX", name: t("teamMexico") },
  { code: "JP", name: t("teamJapao") },
];

export default function ProductCreateScreen({ navigation }) {
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();

  const categoriesList = getCategories(t);
  const teamsList = getTeams(t);
  const moreTeamsList = getMoreTeams(t);
  const [showMoreTeams, setShowMoreTeams] = useState(false);
  const visibleTeams = showMoreTeams
    ? [...teamsList, ...moreTeamsList]
    : teamsList;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");

  const [activeCategory, setActiveCategory] = useState(
    categoriesList[0] || "Camisas",
  );
  const [activeTeam, setActiveTeam] = useState(teamsList[0]?.name || "Brasil");

  function getQuantityValue(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < 0) return 0;
    return Math.floor(numericValue);
  }

  function handleQuantityChange(text) {
    setQuantity(text.replace(/\D/g, ""));
  }

  function incrementQuantity() {
    setQuantity(String(getQuantityValue(quantity) + 1));
  }

  function decrementQuantity() {
    setQuantity(String(Math.max(getQuantityValue(quantity) - 1, 0)));
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
      const targetUserId =
        !user || user.id === "2"
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
        targetUserId,
      );

      showAlert({
        title: t("productCreatedTitle") || "Produto cadastrado",
        message:
          t("productCreatedMessage") || "O produto foi salvo com sucesso.",
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

  const screenBg = theme.bg;
  const cardBg = theme.card;
  const textColor = theme.textPrimary;
  const placeholderColor = theme.textMuted;
  const borderColor = theme.divider;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: screenBg }]}>
        <Pressable
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={GREEN} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          {t("productCreateScreenTitle")}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── ZONA DE UPLOAD DE IMAGEM ─────────────────────────────────── */}
        <TouchableOpacity
          style={[
            styles.imageUpload,
            isDarkMode && { backgroundColor: "rgba(255,255,255,0.02)" },
          ]}
          activeOpacity={0.7}
        >
          {image ? (
            <View style={styles.imagePreviewWrap}>
              <View style={styles.imagePreviewIcon}>
                <MaterialIcons name="image" size={32} color={GREEN} />
              </View>
              <Text style={styles.imagePreviewText} numberOfLines={1}>
                {image}
              </Text>
              <TouchableOpacity
                onPress={() => setImage("")}
                hitSlop={8}
                style={styles.imageClearBtn}
              >
                <MaterialIcons name="close" size={18} color={GREEN} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.imageIcon}>
                <MaterialIcons name="camera-alt" size={28} color={GREEN} />
              </View>
              <Text style={[styles.imageUploadTitle, { color: textColor }]}>
                {t("productCreateScreenAddImageProduct")}
              </Text>
              <Text
                style={[styles.imageUploadSub, { color: placeholderColor }]}
              >
                {t("productCreateScreenAddImageFormat")}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View
          style={[
            styles.urlFieldWrap,
            isDarkMode && { backgroundColor: "rgba(255,255,255,0.04)" },
          ]}
        >
          <MaterialIcons name="link" size={16} color={placeholderColor} />
          <TextInput
            autoCapitalize="none"
            keyboardType="url"
            placeholder={t("imagePlaceholder")}
            placeholderTextColor={placeholderColor}
            style={[styles.urlField, { color: textColor }]}
            value={image}
            onChangeText={setImage}
          />
        </View>

        <View style={styles.fields}>
          {/* ── NOME ───────────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>
              {t("nameLabel")}
            </Text>
            <TextInput
              placeholder={t("productNamePlaceholder")}
              placeholderTextColor={placeholderColor}
              style={[
                styles.input,
                { backgroundColor: cardBg, borderColor, color: textColor },
              ]}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* ── PREÇO ──────────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>
              {t("priceLabel")}
            </Text>
            <View
              style={[
                styles.priceWrap,
                { backgroundColor: cardBg, borderColor },
              ]}
            >
              <Text style={styles.pricePrefix}>R$</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="0,00"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.input,
                  styles.priceInput,
                  { backgroundColor: cardBg, color: textColor },
                ]}
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          {/* ── CATEGORIA ──────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>
              {t("productCreateScreenCategory")}
            </Text>
            <View style={styles.chipsRow}>
              {categoriesList.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      { borderColor },
                      active && styles.chipActive,
                    ]}
                    onPress={() => setActiveCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: textColor },
                        active && styles.chipTextActive,
                      ]}
                    >
                      {cat.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── SELEÇÃO ────────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>
              {t("productCreateScreenSeleção")}
            </Text>
            <View style={styles.teamsGrid}>
              {visibleTeams.map((team) => {
                const active = activeTeam === team.name;
                return (
                  <TouchableOpacity
                    key={team.name}
                    style={[
                      styles.teamBtn,
                      { backgroundColor: cardBg, borderColor },
                      active && styles.teamBtnActive,
                    ]}
                    onPress={() => setActiveTeam(team.name)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.teamCodeBadge,
                        active && styles.teamCodeBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.teamCode,
                          active && styles.teamCodeActive,
                        ]}
                      >
                        {team.code}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.teamName,
                        { color: textColor },
                        active && styles.teamNameActive,
                      ]}
                    >
                      {team.name}
                    </Text>
                    {active && (
                      <View style={styles.teamCheck}>
                        <MaterialIcons name="check" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.moreTeamsBtn, { borderColor }]}
              onPress={() => setShowMoreTeams((prev) => !prev)}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={showMoreTeams ? "expand-less" : "expand-more"}
                size={16}
                color={GREEN}
              />
              <Text style={styles.moreTeamsText}>
                {showMoreTeams
                  ? t("productCreateScreenLessSelections")
                  : t("productCreateScreenMoreSelections")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── QUANTIDADE ─────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>
              {t("productCreateScreenQuantidade")}
            </Text>
            <View style={styles.qtyRow}>
              <Pressable
                disabled={getQuantityValue(quantity) === 0}
                hitSlop={8}
                onPress={decrementQuantity}
                style={[
                  styles.qtyBtn,
                  { backgroundColor: cardBg, borderColor },
                  getQuantityValue(quantity) === 0 && styles.qtyBtnDisabled,
                ]}
              >
                <MaterialIcons
                  name="remove"
                  size={20}
                  color={
                    getQuantityValue(quantity) === 0
                      ? "rgba(21,98,42,0.3)"
                      : GREEN
                  }
                />
              </Pressable>
              <TextInput
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.qtyInput,
                  { backgroundColor: cardBg, borderColor, color: textColor },
                ]}
                value={quantity}
                onChangeText={handleQuantityChange}
              />
              <Pressable
                hitSlop={8}
                onPress={incrementQuantity}
                style={[
                  styles.qtyBtn,
                  { backgroundColor: cardBg, borderColor },
                ]}
              >
                <MaterialIcons name="add" size={20} color={GREEN} />
              </Pressable>
            </View>
          </View>

          {/* ── DESCRIÇÃO ──────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: textColor }]}>
              {t("descriptionLabel")}{" "}
              <Text style={styles.optional}>
                {t("productCreateScreenOpcional")}
              </Text>
            </Text>
            <TextInput
              multiline
              placeholder={t("descriptionPlaceholder")}
              placeholderTextColor={placeholderColor}
              style={[
                styles.input,
                styles.textarea,
                { backgroundColor: cardBg, borderColor, color: textColor },
              ]}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* ── BOTÃO PUBLICAR FIXO ─────────────────────────────────────────── */}
      <View
        style={[
          styles.footer,
          { backgroundColor: screenBg, borderTopColor: borderColor },
        ]}
      >
        <TouchableOpacity
          style={styles.publishBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.publishText}>
            {t("productCreateScreenPublicProduct")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(21,98,42,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  imageUpload: {
    width: "100%",
    height: 150,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(21,98,42,0.25)",
    backgroundColor: "rgba(21,98,42,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    gap: 8,
  },
  imageIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(21,98,42,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageUploadTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  imageUploadSub: {
    fontSize: 11,
    fontWeight: "600",
  },
  imagePreviewWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    width: "100%",
  },
  imagePreviewIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(21,98,42,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreviewText: {
    flex: 1,
    fontSize: 12,
    color: GREEN,
    fontWeight: "600",
  },
  imageClearBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "rgba(21,98,42,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  urlFieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(21,98,42,0.05)",
    marginBottom: 20,
  },
  urlField: {
    flex: 1,
    fontSize: 11,
    fontWeight: "500",
  },
  fields: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  optional: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(13,74,26,0.50)",
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: "600",
    borderWidth: 1.5,
  },
  textarea: {
    minHeight: 90,
    paddingTop: 14,
  },
  priceWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  pricePrefix: {
    paddingLeft: 16,
    paddingRight: 4,
    fontSize: 14,
    fontWeight: "900",
    color: "rgba(21,98,42,0.45)",
    fontVariant: ["tabular-nums"],
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    fontVariant: ["tabular-nums"],
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  chipActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  teamsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  teamBtn: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 6,
    position: "relative",
  },
  teamBtnActive: {
    borderColor: GREEN,
    backgroundColor: "rgba(21,98,42,0.06)",
  },
  teamCodeBadge: {
    width: 26,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(21,98,42,0.10)",
  },
  teamCodeBadgeActive: {
    backgroundColor: GREEN,
  },
  teamCode: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(21,98,42,0.55)",
    letterSpacing: 0.5,
  },
  teamCodeActive: {
    color: "#FFFFFF",
  },
  teamName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  teamNameActive: {
    color: GREEN,
  },
  teamCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  moreTeamsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  moreTeamsText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: GREEN,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    flexGrow: 0,
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyInput: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  publishBtn: {
    backgroundColor: GOLD,
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  publishText: {
    fontSize: 15,
    fontWeight: "900",
    color: GREEN_DARK,
    letterSpacing: 0.8,
  },
});
