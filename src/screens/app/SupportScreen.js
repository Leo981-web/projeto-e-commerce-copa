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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";

const SUPPORT_EMAIL = "suporte@copaworld.com";
const SUPPORT_PHONE = "(49) 99999-0000";

export default function SupportScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSend() {
    const { name, email, subject, message } = form;

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showAlert({
        title: t("requiredFieldsTitle"),
        message: t("supportRequiredFieldsMessage"),
        type: "warning",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert({
        title: t("invalidEmailTitle"),
        message: t("invalidEmailMessage"),
        type: "danger",
      });
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      showAlert({
        title: t("successTitle"),
        message: t("supportSuccessMessage"),
        type: "success",
      });
    }, 900);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
          {t("supportHeaderSub")}
        </Text>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={24} color={theme.titlePrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.titlePrimary }]}>
            {t("supportTitle")}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* FORMULÁRIO */}
        <View
          style={[
            styles.formCard,
            { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" },
          ]}
        >
          <AppInput
            label={t("supportNameLabel")}
            icon="person"
            placeholder={t("supportNamePlaceholder")}
            value={form.name}
            onChangeText={(value) => updateField("name", value)}
            autoCapitalize="words"
          />

          <AppInput
            label={t("supportEmailLabel")}
            icon="email"
            placeholder={t("supportEmailPlaceholder")}
            value={form.email}
            onChangeText={(value) => updateField("email", value)}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AppInput
            label={t("supportSubjectLabel")}
            icon="subject"
            placeholder={t("supportSubjectPlaceholder")}
            value={form.subject}
            onChangeText={(value) => updateField("subject", value)}
          />

          <AppInput
            label={t("supportMessageLabel")}
            icon="message"
            placeholder={t("supportMessagePlaceholder")}
            value={form.message}
            onChangeText={(value) => updateField("message", value)}
            multiline
          />

          <AppButton
            title={sending ? t("supportSending") : t("supportSendButton")}
            onPress={handleSend}
            disabled={sending}
            icon="send"
            style={{ marginTop: 4 }}
          />
        </View>

        {/* CANAIS DE CONTATO */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          {t("supportChannelsTitle")}
        </Text>
        <View
          style={[
            styles.optionsBlock,
            { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" },
          ]}
        >
          <View style={[styles.channelRow, { borderBottomColor: theme.divider }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="email" size={20} color={theme.textPrimary} />
            </View>
            <View style={styles.channelTextContainer}>
              <Text style={[styles.channelLabel, { color: theme.textMuted }]}>
                {t("supportChannelEmailLabel")}
              </Text>
              <Text style={[styles.channelValue, { color: theme.textPrimary }]}>
                {SUPPORT_EMAIL}
              </Text>
            </View>
          </View>

          <View style={[styles.channelRow, { borderBottomColor: theme.divider }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="phone" size={20} color={theme.textPrimary} />
            </View>
            <View style={styles.channelTextContainer}>
              <Text style={[styles.channelLabel, { color: theme.textMuted }]}>
                {t("supportChannelPhoneLabel")}
              </Text>
              <Text style={[styles.channelValue, { color: theme.textPrimary }]}>
                {SUPPORT_PHONE}
              </Text>
            </View>
          </View>

          <View style={[styles.channelRow, styles.channelRowLast]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="schedule" size={20} color={theme.textPrimary} />
            </View>
            <View style={styles.channelTextContainer}>
              <Text style={[styles.channelLabel, { color: theme.textMuted }]}>
                {t("supportChannelHoursLabel")}
              </Text>
              <Text style={[styles.channelValue, { color: theme.textPrimary }]}>
                {t("supportChannelHoursValue")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
    marginLeft: 2,
  },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 3,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  formCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  optionsBlock: {
    borderRadius: 18,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
  },
  channelRowLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  channelTextContainer: { flex: 1, marginLeft: 14 },
  channelLabel: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  channelValue: { fontSize: 14, fontWeight: "700" },
});
