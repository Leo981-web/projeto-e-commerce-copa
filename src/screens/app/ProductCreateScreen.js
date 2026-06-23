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
const GREEN      = "#15622A";
const GREEN_DARK = "#0D4A1A";
const GREEN_MID  = "#22C55E";
const GOLD       = "#F5C518";

const CATEGORIES = ["Camisas", "Bolas", "Calçados", "Acessórios", "Outros"];

const TEAMS = [
  { flag: "🇧🇷", code: "BR", name: "Brasil"    },
  { flag: "🇦🇷", code: "AR", name: "Argentina" },
  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "EN", name: "Inglaterra" },
  { flag: "🇩🇪", code: "DE", name: "Alemanha"  },
  { flag: "🇫🇷", code: "FR", name: "França"    },
  { flag: "🇵🇹", code: "PT", name: "Portugal"  },
];

export default function ProductCreateScreen({ navigation }) {
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();

  // ── Estado (LÓGICA ORIGINAL INTACTA) ─────────────────────────────────
  const [name, setName]             = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice]           = useState("");
  const [quantity, setQuantity]     = useState("");
  const [image, setImage]           = useState("");

  // Estado visual extra (não interfere na lógica de submit)
  const [activeCategory, setActiveCategory] = useState("Camisas");
  const [activeTeam, setActiveTeam]         = useState("Brasil");

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

    const parsedPrice    = parseCurrencyInput(price);
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
        { name, description, price: parsedPrice, quantity: parsedQuantity, image },
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
  // ─────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={GREEN} />
        </Pressable>
        <Text style={styles.headerTitle}>ADICIONAR PRODUTO</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── ZONA DE UPLOAD DE IMAGEM ─────────────────────────────────── */}
        <TouchableOpacity style={styles.imageUpload} activeOpacity={0.7}>
          {image ? (
            <View style={styles.imagePreviewWrap}>
              <View style={styles.imagePreviewIcon}>
                <MaterialIcons name="image" size={32} color={GREEN} />
              </View>
              <Text style={styles.imagePreviewText} numberOfLines={1}>{image}</Text>
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
              <Text style={styles.imageUploadTitle}>Adicionar foto do produto</Text>
              <Text style={styles.imageUploadSub}>JPG, PNG ou HEIC • até 10MB</Text>
            </>
          )}
        </TouchableOpacity>

        {/* URL da imagem (campo oculto visualmente mas funcional) */}
        <View style={styles.urlFieldWrap}>
          <MaterialIcons name="link" size={16} color="rgba(21,98,42,0.4)" />
          <TextInput
            autoCapitalize="none"
            keyboardType="url"
            placeholder={t("imagePlaceholder")}
            placeholderTextColor="rgba(21,98,42,0.4)"
            style={styles.urlField}
            value={image}
            onChangeText={setImage}
          />
        </View>

        <View style={styles.fields}>

          {/* ── NOME ───────────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("nameLabel")}</Text>
            <TextInput
              placeholder={t("productNamePlaceholder")}
              placeholderTextColor="rgba(21,98,42,0.35)"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* ── PREÇO ──────────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("priceLabel")}</Text>
            <View style={styles.priceWrap}>
              <Text style={styles.pricePrefix}>R$</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="0,00"
                placeholderTextColor="rgba(21,98,42,0.35)"
                style={[styles.input, styles.priceInput]}
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          {/* ── CATEGORIA ──────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CATEGORIA</Text>
            <View style={styles.chipsRow}>
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setActiveCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {cat.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── SELEÇÃO ────────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>SELEÇÃO</Text>
            <View style={styles.teamsGrid}>
              {TEAMS.map((team) => {
                const active = activeTeam === team.name;
                return (
                  <TouchableOpacity
                    key={team.name}
                    style={[styles.teamBtn, active && styles.teamBtnActive]}
                    onPress={() => setActiveTeam(team.name)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.teamFlag}>
                      {team.flag} <Text style={[styles.teamCode, active && { color: GREEN }]}>{team.code}</Text>
                    </Text>
                    <Text style={[styles.teamName, active && styles.teamNameActive]}>
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
          </View>

          {/* ── QUANTIDADE ─────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>QUANTIDADE</Text>
            <View style={styles.qtyRow}>
              <Pressable
                disabled={getQuantityValue(quantity) === 0}
                hitSlop={8}
                onPress={decrementQuantity}
                style={[styles.qtyBtn, getQuantityValue(quantity) === 0 && styles.qtyBtnDisabled]}
              >
                <MaterialIcons name="remove" size={20} color={getQuantityValue(quantity) === 0 ? "rgba(21,98,42,0.3)" : GREEN} />
              </Pressable>
              <TextInput
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="rgba(21,98,42,0.35)"
                style={styles.qtyInput}
                value={quantity}
                onChangeText={handleQuantityChange}
              />
              <Pressable
                hitSlop={8}
                onPress={incrementQuantity}
                style={styles.qtyBtn}
              >
                <MaterialIcons name="add" size={20} color={GREEN} />
              </Pressable>
            </View>
          </View>

          {/* ── DESCRIÇÃO ──────────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t("descriptionLabel")} <Text style={styles.optional}>(OPCIONAL)</Text></Text>
            <TextInput
              multiline
              placeholder={t("descriptionPlaceholder")}
              placeholderTextColor="rgba(21,98,42,0.35)"
              style={[styles.input, styles.textarea]}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

        </View>
      </ScrollView>

      {/* ── BOTÃO PUBLICAR FIXO ─────────────────────────────────────────── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.publishBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.publishText}>PUBLICAR PRODUTO</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F0F7F1",
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#F0F7F1",
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
    color: GREEN_DARK,
    letterSpacing: 0.5,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // ── Upload de imagem ──────────────────────────────────────────────────────
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
    color: GREEN_DARK,
  },
  imageUploadSub: {
    fontSize: 11,
    color: GREEN_DARK,
    fontWeight: "600",
    opacity: 0.6,
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

  // URL field compacto
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
    color: GREEN,
    fontWeight: "500",
  },

  // ── Campos ────────────────────────────────────────────────────────────────
  fields: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: GREEN_DARK,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  optional: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(13,74,26,0.50)",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: GREEN_DARK,
    fontWeight: "600",
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.15)",
  },
  textarea: {
    minHeight: 90,
    paddingTop: 14,
  },

  // Preço
  priceWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.12)",
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

  // Categorias
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
    borderColor: "rgba(21,98,42,0.2)",
    backgroundColor: "transparent",
  },
  chipActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "900",
    color: GREEN_DARK,
    letterSpacing: 0.5,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },

  // Seleções (grid 2 colunas)
  teamsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  teamBtn: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.15)",
    backgroundColor: "#FFFFFF",
    gap: 6,
    position: "relative",
  },
  teamBtnActive: {
    borderColor: GREEN,
    backgroundColor: "rgba(21,98,42,0.06)",
  },
  teamFlag: {
    fontSize: 13,
  },
  teamCode: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(21,98,42,0.45)",
    letterSpacing: 0.5,
  },
  teamName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: GREEN_DARK,
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

  // Quantidade
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.2)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.12)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "900",
    color: GREEN_DARK,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },

  // ── Rodapé fixo ───────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 14,
    backgroundColor: "#F0F7F1",
    borderTopWidth: 1,
    borderTopColor: "rgba(21,98,42,0.08)",
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
  publishEmoji: {
    fontSize: 16,
  },
});