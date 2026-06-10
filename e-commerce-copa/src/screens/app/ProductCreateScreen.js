import { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import QuantityInput from "../../components/QuantityInput";
import ScreenHeader from "../../components/ScreenHeader";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useAuth } from "../../context/AuthContext";
import { parseCurrencyInput } from "../../services/formatters";
import * as productService from "../../services/productService";

const NAVY   = "#1A237E";
const GREEN  = "#00A650";
const YELLOW = "#FFD600";
const CREAM  = "#F5F1E8";
const WHITE  = "#FFFFFF";

const COUNTRIES = [
  { key: "brasil",     flag: "BR", label: "Brasil",     bg: "#D4EDDA", accent: "#009C3B" },
  { key: "argentina",  flag: "AR", label: "Argentina",  bg: "#D6E8F5", accent: "#74ACDF" },
  { key: "franca",     flag: "FR", label: "França",     bg: "#DDEAF7", accent: "#002395" },
  { key: "alemanha",   flag: "DE", label: "Alemanha",   bg: "#E8E8E8", accent: "#353030" },
  { key: "portugal",   flag: "PT", label: "Portugal",   bg: "#D4EDDA", accent: "#006600" },
  { key: "espanha",    flag: "ES", label: "Espanha",    bg: "#F7DADA", accent: "#81080c" },
  { key: "italia",     flag: "IT", label: "Italia",     bg: "#DDEAF7", accent: "#003DA5" },
  { key: "estados_unidos", flag: "US", label: "Estados Unidos", bg: "#FFF0F0", accent: "#db232c" },
];

// Note: using text flags instead of emoji flags to avoid SVG/rendering issues
const COUNTRY_EMOJIS = {
  brasil: "🇧🇷", argentina: "🇦🇷", franca: "🇫🇷", alemanha: "🇩🇪",
  portugal: "🇵🇹", espanha: "🇪🇸", italia: "🇮🇹", estados_unidos: "🇺🇸",
};

export default function ProductCreateScreen({ navigation }) {
  const { showAlert } = useCustomAlert();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [country, setCountry] = useState(null);

  const { user } = useAuth();

  // ── logica original intacta ──────────────────────────────────────────────
  async function handleSubmit() {
    if (!name || !description || !price || !quantity || !image) {
      showAlert({
        title: "Campos obrigatorios",
        message: "Preencha todos os campos do produto.",
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
        title: "Dados invalidos",
        message: "Informe um preco valido e uma quantidade inteira. Os valores nao podem ser negativos.",
        type: "danger",
      });
      return;
    }

    try {
      await productService.createProduct(
        { name, description, price, quantity, image },
        user.id,
      );
      showAlert({
        title: "Produto cadastrado",
        message: "O produto foi salvo com sucesso.",
        type: "success",
        buttonText: "Voltar para a lista",
        onClose: () => navigation.goBack(),
      });
    } catch (error) {
      showAlert({
        title: "Erro ao cadastrar produto",
        message: error.message,
        type: "danger",
      });
    }
  }

  const selectedCountry = COUNTRIES.find(c => c.key === country);

  return (
    <SafeAreaView style={styles.safe}>

      {/* Decoracao inferior esquerdo */}
      <View style={styles.waveBottomLeft} pointerEvents="none">
        <Svg width="200" height="180" viewBox="0 0 200 180">
          <Circle cx="30" cy="120" r="40" fill="#00A650" opacity="0.18" />
          <Path d="M60 160 Q90 100 140 70" stroke="#1A237E" strokeWidth="2" fill="none" opacity="0.12" />
          <Path d="M50 170 Q100 100 155 65" stroke="#1A237E" strokeWidth="2" fill="none" opacity="0.09" />
          <Path d="M40 180 Q110 105 170 60" stroke="#1A237E" strokeWidth="2" fill="none" opacity="0.07" />
          <Path d="M70 175 Q120 108 180 55" stroke="#1A237E" strokeWidth="2" fill="none" opacity="0.05" />
          <Path d="M155 15 L188 15 L188 48 L155 48 Z" fill="#FFD600" opacity="0.22" />
        </Svg>
      </View>

      {/* Decoracao superior direito */}
      <View style={styles.waveTopRight} pointerEvents="none">
        <Svg width="180" height="160" viewBox="0 0 180 160">
          <Circle cx="150" cy="28" r="32" fill="#FFD600" opacity="0.2" />
          <Path d="M140 10 Q100 60 55 85" stroke="#1A237E" strokeWidth="2" fill="none" opacity="0.11" />
          <Path d="M150 5 Q105 58 60 88" stroke="#1A237E" strokeWidth="2" fill="none" opacity="0.08" />
          <Path d="M160 0 Q115 62 68 92" stroke="#1A237E" strokeWidth="2" fill="none" opacity="0.06" />
          <Path d="M170 4 Q122 66 75 96" stroke="#1A237E" strokeWidth="2" fill="none" opacity="0.05" />
          <Path d="M8 130 L38 130 L38 158 L8 158 Z" fill="#00A650" opacity="0.15" />
        </Svg>
      </View>

      {/* Decoracao meio esquerdo */}
      <View style={styles.waveMiddleLeft} pointerEvents="none">
        <Svg width="130" height="130" viewBox="0 0 130 130">
          <Circle cx="18" cy="65" r="22" fill="#1A237E" opacity="0.07" />
          <Path d="M38 110 Q65 65 105 38" stroke="#00A650" strokeWidth="2" fill="none" opacity="0.13" />
          <Path d="M28 120 Q70 70 112 32" stroke="#00A650" strokeWidth="2" fill="none" opacity="0.09" />
          <Path d="M18 130 Q75 75 120 26" stroke="#00A650" strokeWidth="2" fill="none" opacity="0.06" />
          <Path d="M95 8 L122 8 L122 35 L95 35 Z" fill="#FFD600" opacity="0.18" />
        </Svg>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Novo produto" onBack={() => navigation.goBack()} />

        {/* Card dados */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <SimpleLineIcons name="trophy" size={16} color={YELLOW} />
            <Text style={styles.cardTitle}>Dados do produto</Text>
          </View>

          <AppInput
            icon="inventory-2"
            label="Nome"
            onChangeText={setName}
            placeholder="Nome do produto"
            value={name}
          />
          <AppInput
            icon="description"
            label="Descricao"
            multiline
            onChangeText={setDescription}
            placeholder="Descricao do produto"
            value={description}
          />
          <AppInput
            icon="payments"
            keyboardType="numeric"
            label="Preco (R$)"
            onChangeText={setPrice}
            placeholder="0,00"
            value={price}
          />
          <QuantityInput onChangeText={setQuantity} value={quantity} />
          <AppInput
            autoCapitalize="none"
            icon="image"
            keyboardType="url"
            label="Imagem"
            onChangeText={setImage}
            placeholder="https://exemplo.com/produto.jpg"
            value={image}
          />
        </View>

        {/* Seletor de pais */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="football-outline" size={16} color={NAVY} />
            <Text style={styles.cardTitle}>Pais da selecao</Text>
          </View>

          <View style={styles.countriesGrid}>
            {COUNTRIES.map(c => (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.countryChip,
                  { backgroundColor: c.bg, borderColor: country === c.key ? c.accent : "transparent" },
                  country === c.key && styles.countryChipActive,
                ]}
                onPress={() => setCountry(c.key)}
              >
                <Text style={styles.countryFlag}>{COUNTRY_EMOJIS[c.key]}</Text>
                <Text style={[styles.countryLabel, { color: c.accent }]}>{c.label}</Text>
                {country === c.key && (
                  <View style={[styles.countryCheck, { backgroundColor: c.accent }]}>
                    <Ionicons name="checkmark" size={10} color={WHITE} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {selectedCountry && (
            <View style={[styles.previewBar, { backgroundColor: selectedCountry.bg, borderLeftColor: selectedCountry.accent }]}>
              <Text style={styles.previewFlag}>{COUNTRY_EMOJIS[selectedCountry.key]}</Text>
              <Text style={[styles.previewText, { color: selectedCountry.accent }]}>
                Produto aparecera com tema de {selectedCountry.label}
              </Text>
            </View>
          )}
        </View>

        <AppButton
          icon="save"
          onPress={handleSubmit}
          style={styles.submitButton}
          title="Salvar produto"
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CREAM,
  },

  waveBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 200,
    height: 180,
    zIndex: 0,
  },
  waveTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 180,
    height: 160,
    zIndex: 0,
  },
  waveMiddleLeft: {
    position: "absolute",
    top: "42%",
    left: 0,
    width: 130,
    height: 130,
    zIndex: 0,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: NAVY,
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: -10,
    marginBottom: 14,
  },

  countriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  countryChip: {
    width: "22%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    position: "relative",
    gap: 4,
  },
  countryChipActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  countryFlag: {
    fontSize: 22,
  },
  countryLabel: {
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },
  countryCheck: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  previewBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  previewFlag: {
    fontSize: 20,
  },
  previewText: {
    fontSize: 12,
    fontWeight: "700",
  },

  submitButton: {
    marginTop: 4,
  },
});