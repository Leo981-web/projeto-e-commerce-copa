import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguage } from "../../context/LanguageContext";

import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppText from "../../components/AppText";
import { useAuth } from "../../context/AuthContext";
import { useCustomAlert } from "../../context/CustomAlertContext";

import logo from "../../assets/logo.png"

const NAVY   = '#1A237E';
const GREEN  = '#00A650';
const YELLOW = '#FFD600';
const CREAM  = '#F5F1E8';

export default function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  async function handleLogin() {
    try {
      await login(email, password);
    } catch (error) {
      showAlert({
        title: t("loginErrorTitle"),
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
          <Image source={logo} style={styles.logoImage} />
          <View>
            <Text style={styles.logoTitle}>{t("logoTitle")}</Text>
            <Text style={styles.logoSub}>{t("logoSub")}</Text>
          </View>
        </View>

        {/* Adicionado o {'\n'} direto no código junto com a tradução */}
        <Text style={styles.headline}>{t("loginHeadline1")}{'\n'}{t("loginHeadline2")}</Text>
        <Text style={styles.subheadline}>{t("loginSubheadline")}</Text>

        <View style={styles.card}>

          <AppInput
            autoCapitalize="none"
            icon="person"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder={t("userPlaceholder")}
            value={email}
            style={styles.inputYellow}
          />

          <AppInput
            icon="lock"
            isPassword
            onChangeText={setPassword}
            placeholder={t("passwordPlaceholder")}
            value={password}
            style={styles.inputGreen}
          />

          <TouchableOpacity style={styles.forgotWrap}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>{t("forgotPassword")}</Text>
          </TouchableOpacity>

          <AppButton
            disabled={loading}
            icon="login"
            onPress={handleLogin}
            title={loading ? t("loggingIn") : t("loginButton")}
          />

          <AppButton
            icon="person-add-alt"
            onPress={() => navigation.replace("Register")}
            style={styles.linkButton}
            title={t("createAccount")}
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
    gap: 12,
    marginTop: 45,
  },

  logoImage: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },

  logoTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: NAVY,
    letterSpacing: 1,
    lineHeight: 34,
  },
  logoSub: {
    fontSize: 19,
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
  forgotWrap: {
    alignSelf: 'flex-start',
    marginTop: -6,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '800',
    color: NAVY,
    textDecorationLine: 'underline',
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 10,
  },
});