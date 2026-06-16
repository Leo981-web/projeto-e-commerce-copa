import { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppText from "../../components/AppText";
import { useAuth } from "../../context/AuthContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext"; 

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

  async function handleRegister() {
    try {
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

      <View style={styles.container}>

        <View style={styles.logoRow}>
          <Ionicons name="football-outline" size={52} color={NAVY} />
          <View>
            <Text style={styles.logoTitle}>{t("logoTitle")}</Text>
            <Text style={styles.logoSub}>{t("logoSub")}</Text>
          </View>
        </View>

        <Text style={styles.headline}>{t("registerHeadline")}</Text>
        <Text style={styles.subheadline}>{t("registerSubheadline")}</Text>

        <View style={styles.card}>

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
    paddingTop: 0,
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
    marginTop: 48,
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
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
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