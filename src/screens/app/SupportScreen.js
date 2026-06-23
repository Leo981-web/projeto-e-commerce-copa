import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";

const GREEN      = "#15622A";
const GREEN_DARK = "#0D4A1A";
const GREEN_MID  = "#22C55E";
const GOLD       = "#F5C518";

export default function SupportScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSend() {
    const { name, email, subject, message } = form;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showAlert({ title: t("requiredFieldsTitle"), message: t("supportRequiredFieldsMessage"), type: "warning" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert({ title: t("invalidEmailTitle"), message: t("invalidEmailMessage"), type: "danger" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      showAlert({ title: t("successTitle"), message: t("supportSuccessMessage"), type: "success" });
    }, 900);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN_DARK} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── HERO VERDE ──────────────────────────────────────────────────── */}
        <View style={styles.hero}>

          {/* Botão voltar centralizado verticalmente entre as 2 linhas de texto */}
          <View style={styles.heroInner}>
            {/* Coluna do botão — centralizada entre título e subtítulo */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Coluna dos textos empilhados */}
            <View style={styles.heroTexts}>
              <Text style={styles.heroTitle}>
                <Text style={{ color: GOLD }}>Fale</Text>
                {" conosco!"}
              </Text>
              <Text style={styles.heroSub}>Resposta em até 24 horas úteis</Text>
            </View>
          </View>
        </View>

        {/* ── BARRA DE DISPONIBILIDADE ─────────────────────────────────────── */}
        <View style={styles.availabilityBar}>
          <View style={styles.availDot} />
          <Text style={styles.availText}>Disponível agora</Text>
          <View style={styles.availSep} />
          <MaterialIcons name="schedule" size={12} color="rgba(255,255,255,0.92)" />
          <Text style={styles.availSub}>Seg–Sex · 08h–18h</Text>
        </View>

        {/* ── FORMULÁRIO ──────────────────────────────────────────────────── */}
        <View style={styles.formSection}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionLabel}>Envie sua mensagem</Text>
          </View>

          <View style={[styles.formCard, { backgroundColor: theme.card }]}>
            <Text style={styles.inputLabel}>{t("supportNameLabel")}</Text>
            <AppInput
              icon="person"
              placeholder={t("supportNamePlaceholder")}
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
              autoCapitalize="words"
              style={styles.inputAccent}
            />
            <Text style={styles.inputLabel}>{t("supportEmailLabel")}</Text>
            <AppInput
              icon="email"
              placeholder={t("supportEmailPlaceholder")}
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.inputAccent}
            />
            <Text style={styles.inputLabel}>{t("supportSubjectLabel")}</Text>
            <AppInput
              icon="subject"
              placeholder={t("supportSubjectPlaceholder")}
              value={form.subject}
              onChangeText={(v) => updateField("subject", v)}
              style={styles.inputAccent}
            />
            <Text style={styles.inputLabel}>{t("supportMessageLabel")}</Text>
            <AppInput
              icon="message"
              placeholder={t("supportMessagePlaceholder")}
              value={form.message}
              onChangeText={(v) => updateField("message", v)}
              multiline
              style={styles.inputAccent}
            />
            <AppButton
              title={sending ? t("supportSending") : t("supportSendButton")}
              onPress={handleSend}
              disabled={sending}
              icon="send"
              style={styles.sendBtn}
            />
          </View>
        </View>

        {/* ── RODAPÉ ──────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>suporte@copaworld.com</Text>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>(49) 99999-0000</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F7F1" },
  scroll: { paddingBottom: 48 },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: GREEN_DARK,
    paddingTop: 16,
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  // MUDANÇA: botão e textos lado a lado, botão centralizado entre as 2 linhas
  heroInner: {
    flexDirection: "row",
    alignItems: "center",   // centraliza o botão verticalmente em relação ao bloco de textos
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heroTexts: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  heroSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },

  // ── Disponibilidade ────────────────────────────────────────────────────────
  availabilityBar: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  availDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN_MID },
  availText: { fontSize: 12, fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.2 },
  availSep: { width: 1, height: 13, backgroundColor: "rgba(255,255,255,0.93)", marginHorizontal: 2 },
  availSub: { fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: "600" },

  // ── Formulário ─────────────────────────────────────────────────────────────
  formSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionAccent: { width: 4, height: 18, borderRadius: 2, backgroundColor: GREEN },
  sectionLabel: { fontSize: 12, fontWeight: "800", color: GREEN, textTransform: "uppercase", letterSpacing: 1 },
  formCard: {
    borderRadius: 18, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
    borderWidth: 1.5, borderColor: "rgba(35,136,35,0.1)",
  },
  inputAccent: { borderLeftWidth: 4, borderLeftColor: GREEN, borderRadius: 14, overflow: "hidden" },
  inputLabel: { fontSize: 13, fontWeight: "700", color: GREEN_DARK, marginBottom: 4, marginTop: 8, marginLeft: 2 },
  sendBtn: { marginTop: 4, backgroundColor: GREEN_DARK },

  // ── Rodapé ─────────────────────────────────────────────────────────────────
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 20 },
  footerText: { fontSize: 14, color: GREEN, fontWeight: "700" },
  footerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "rgba(20,92,39,0.3)" },
});