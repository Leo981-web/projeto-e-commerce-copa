import { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppText from "../../components/AppText";
import { useAuth } from "../../context/AuthContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext"; 

import logo from "../../assets/logo.png"

const NAVY   = '#1A237E';
const GREEN  = '#00A650';
const YELLOW = '#FFD600';
const CREAM  = '#F5F1E8';

export default function RegisterScreen({ navigation }) {
  const { loading, register } = useAuth();
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  // ── AJUSTE: Estados para controlar o perfil Comprador/Vendedor e campos extras ──
  const [accountType, setAccountType] = useState("buyer");
  const [storeName, setStoreName] = useState("");
  const [cnpj, setCnpj] = useState("");

  async function handleRegister() {
    try {
      // Ajustado caso queira passar a role ou os dados extras para o serviço de auth futuro
      await register(name, email, password, phone);
    } catch (error) {
      showAlert({
        title: t("registerErrorTitle"), 
        message: error.message,
        type: "warning",
      });
    }
  }

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.squareTopRight} />
      <View style={styles.circleTopLeft} />
      <View style={styles.diamondBottomLeft} />
      <View style={styles.circleBottomRight} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.container}>

          <View style={styles.logoRow}>
            <Image source={logo} style={styles.logoImage} />
            <View>
              <Text style={styles.logoTitle}>{t("logoTitle")}</Text>
              <Text style={styles.logoSub}>{t("logoSub")}</Text>
            </View>
          </View>

          <Text style={styles.headline}>{t("registerHeadline")}</Text>
          <Text style={styles.subheadline}>{t("registerSubheadline")}</Text>

          <View style={styles.card}>

            {/* ── AJUSTE: Seletor Visual de Tipo de Conta ────────────────── */}
            <View style={styles.roleSelector}>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={[styles.roleTab, accountType === "buyer" && styles.roleTabActiveBuyer]}
                onPress={() => setAccountType("buyer")}
              >
                <Ionicons name="cart-outline" size={16} color={accountType === "buyer" ? "#FFFFFF" : NAVY} />
                <Text style={[styles.roleText, accountType === "buyer" && styles.roleTextActive]}>{t("comprador")}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.8}
                style={[styles.roleTab, accountType === "seller" && styles.roleTabActiveSeller]}
                onPress={() => setAccountType("seller")}
              >
                <Ionicons name="storefront-outline" size={16} color={accountType === "seller" ? "#FFFFFF" : NAVY} />
                <Text style={[styles.roleText, accountType === "seller" && styles.roleTextActive]}>{t("vendedor")}</Text>
              </TouchableOpacity>
            </View>
            {/* ──────────────────────────────────────────────────────────── */}

            <AppInput
              icon="person"
              onChangeText={setName}
              placeholder={t("namePlaceholder")}
              value={name}
              style={styles.inputYellow}
            />

            <AppInput
              autoCapitalize="none"
              icon="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder={t("emailPlaceholder")}
              value={email}
              style={styles.inputGreen}
            />

            {/* ── AJUSTE: Campos Extras Exclusivos de Vendedor (Renderização Condicional) ── */}
            {accountType === "seller" && (
              <View style={{ animation: "fadeIn" }}>
                <AppInput
                  icon="store"
                  onChangeText={setStoreName}
                  placeholder="Nome comercial da Loja"
                  value={storeName}
                  style={styles.inputYellow}
                />
                <AppInput
                  icon="business"
                  keyboardType="numeric"
                  onChangeText={setCnpj}
                  placeholder="CNPJ (00.000.000/0001-00)"
                  value={cnpj}
                  style={styles.inputGreen}
                />
              </View>
            )}
            {/* ───────────────────────────────────────────────────────────────────────── */}

            <AppInput
              icon="lock"
              isPassword
              onChangeText={setPassword}
              placeholder={t("passwordPlaceholder")}
              value={password}
              style={styles.inputNavy}
            />

            <AppInput
              icon="phone"
              keyboardType="phone-pad"
              onChangeText={setPhone}
              placeholder={t("phonePlaceholder")}
              value={phone}
              style={styles.inputYellow}
            />

            <AppButton
              disabled={loading}
              icon="person-add-alt"
              onPress={handleRegister}
              title={loading ? t("registering") : t("registerButton")}
            />

          <AppButton
            icon="arrow-back"
            onPress={() => navigation.replace("Login")}
            style={styles.linkButton}
            title={t("backToLogin")}
            variant="ghost"
          />
        </View>

      </View>
     </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CREAM,
  },
  squareTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 170,
    height: 150,
    borderRadius: 32,
    backgroundColor: NAVY,
    opacity: 0.85,
  },
  circleTopLeft: {
    position: 'absolute',
    top: -25,
    left: -100,
    width: 180,
    height: 180,
    borderRadius: 80,
    backgroundColor: YELLOW,
    opacity: 0.35,
  },
  diamondBottomLeft: {
    position: 'absolute',
    bottom: 40,
    left: -40,
    width: 130,
    height: 130,
    borderRadius: 24,
    borderWidth: 14,
    borderColor: GREEN,
    backgroundColor: 'transparent',
    transform: [{ rotate: '45deg' }],
    opacity: 0.35,
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: YELLOW,
    opacity: 0.55,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 45,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: NAVY,
    letterSpacing: 1,
    lineHeight: 28,
  },
  logoSub: {
    fontSize: 16,
    fontWeight: '700',
    color: GREEN,
    letterSpacing: 2,
  },
  headline: {
    fontSize: 32,
    fontWeight: '900',
    color: NAVY,
    lineHeight: 38,
    marginTop: 35,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 16,
    fontWeight: '600',
    color: GREEN,
    marginBottom: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  logoImage: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  // ── AJUSTE: Estilos das novas abas integradas ao tema da tela ──
  roleSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(26,35,126,0.06)",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  roleTabActiveBuyer: {
    backgroundColor: NAVY,
  },
  roleTabActiveSeller: {
    backgroundColor: GREEN,
  },
  roleText: {
    fontSize: 13,
    fontWeight: "700",
    color: NAVY,
  },
  roleTextActive: {
    color: "#FFFFFF",
  },
  // ─────────────────────────────────────────────────────────────
  inputYellow: {
    borderLeftWidth: 4,
    borderLeftColor: YELLOW,
    borderRadius: 14,
    overflow: 'hidden',
  },
  inputGreen: {
    borderLeftWidth: 4,
    borderLeftColor: GREEN,
    borderRadius: 14,
    overflow: 'hidden',
  },
  inputNavy: {
    borderLeftWidth: 4,
    borderLeftColor: NAVY,
    borderRadius: 14,
    overflow: 'hidden',
  },
  linkButton: {
    marginTop: 10,
  },
});