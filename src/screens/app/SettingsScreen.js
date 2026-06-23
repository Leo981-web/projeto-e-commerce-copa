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
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useTheme } from "../../context/ThemeContext";
import ToggleSwitch from "toggle-switch-react-native";

const WHITE            = "#FFFFFF";
const NAVY_BLUE        = "#1A237E";
const NAVY_TRACK_LIGHT = "#C5CAE9";
const GREEN            = "#15622A";
const GREEN_DARK       = "#0D4A1A";
const GOLD             = "#F5C518";

function SettingsSection({ title, children, cardBg, dividerColor, shadowColor }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[sectionStyles.label, { color: GREEN }]}>{title}</Text>
      <View style={[sectionStyles.block, { backgroundColor: cardBg, borderColor: dividerColor, shadowColor }]}>
        {children}
      </View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  label: {
    fontSize: 11, fontWeight: "800", textTransform: "uppercase",
    letterSpacing: 1.4, marginBottom: 8, marginLeft: 2,
  },
  block: {
    borderRadius: 16, overflow: "hidden", borderWidth: 1.5,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
});

function SettingRow({ icon, title, subtitle, right, last, textColor, mutedColor, iconBg, dividerColor, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      activeOpacity={0.7}
      onPress={onPress}
      style={[rowStyles.row, !last && { borderBottomWidth: 1, borderBottomColor: dividerColor }]}
    >
      <View style={[rowStyles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={20} color={GREEN} />
      </View>
      <View style={rowStyles.textWrap}>
        <Text style={[rowStyles.title, { color: textColor }]}>{title}</Text>
        {subtitle ? <Text style={[rowStyles.subtitle, { color: mutedColor }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </Wrapper>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  textWrap: { flex: 1, marginLeft: 13, paddingRight: 8 },
  title: { fontSize: 14, fontWeight: "700" },
  subtitle: { fontSize: 11, marginTop: 2, lineHeight: 14 },
});

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const { showAlert, showConfirm } = useCustomAlert();
  const { t, locale, changeLanguage } = useLanguage();
  const { isDarkMode, theme, toggleTheme } = useTheme();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [biometrics, setBiometrics]               = useState(false);

  const screenBg     = isDarkMode ? "#0F1117" : "#F0F7F1";
  const cardBg       = isDarkMode ? "#1C1F2A" : WHITE;
  const textColor    = isDarkMode ? "#F3F4F6" : "#111827";
  const mutedColor   = isDarkMode ? "#9CA3AF" : "#6B7280";
  const dividerColor = isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(21,98,42,0.08)";
  const iconBg       = isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(21,98,42,0.08)";
  const backIconColor = isDarkMode ? "#F3F4F6" : WHITE;
  const chevronColor = isDarkMode ? "#4B5563" : "#9CA3AF";
  const statusBar    = "light-content"; // sempre claro pois o hero é escuro

  async function handleLogout() {
    try { await logout(); }
    catch (error) { showAlert({ title: t("logoutErrorTitle"), message: error.message, type: "danger" }); }
  }

  function confirmLogout() {
    showConfirm({
      title: t("logoutAlertTitle"), message: t("logoutAlertMessage"),
      confirmText: t("logoutConfirm"), cancelText: t("cancel"),
      type: "danger", onConfirm: handleLogout,
    });
  }

  const rowTheme = { textColor, mutedColor, iconBg, dividerColor };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={statusBar} backgroundColor={GREEN_DARK} />

      {/* ── HERO VERDE ESCURO (igual ao Support) ───────────────────────────── */}
      <View style={styles.hero}>
        {/* Listras decorativas */}
        <View style={styles.stripe1} pointerEvents="none" />
        <View style={styles.stripe2} pointerEvents="none" />

        <View style={styles.heroInner}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={22} color={WHITE} />
          </TouchableOpacity>

          <View style={styles.heroTexts}>
            <Text style={styles.heroEyebrow}>Preferências Globais</Text>
            <Text style={styles.heroTitle}>
              <Text style={{ color: GOLD }}>{t("settingsTitle")}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* ── CONTEÚDO ────────────────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <SettingsSection title={t("appearanceAndLanguage")} cardBg={cardBg} dividerColor={dividerColor} shadowColor={isDarkMode ? "#000" : GREEN}>
          <SettingRow {...rowTheme} icon={isDarkMode ? "dark-mode" : "light-mode"} title={t("darkTheme")} subtitle={t("darkThemeSub")}
            right={<ToggleSwitch isOn={isDarkMode} onColor={NAVY_TRACK_LIGHT} offColor={isDarkMode ? "#374151" : "#D1D5DB"} thumbOnStyle={{ backgroundColor: NAVY_BLUE }} thumbOffStyle={{ backgroundColor: "#9CA3AF" }} size="medium" onToggle={toggleTheme} />}
          />
          <SettingRow {...rowTheme} icon="g-translate" title={t("appLanguage")} subtitle={t("appLanguageSub")} last
            right={
              <View style={[styles.langSelector, { backgroundColor: iconBg }]}>
                {["PT", "EN", "ES"].map((lang) => {
                  const isSelected = locale === lang;
                  return (
                    <TouchableOpacity key={lang} style={[styles.langOption, isSelected && styles.langOptionActive]} onPress={() => changeLanguage(lang)}>
                      <Text style={[styles.langText, { color: isSelected ? WHITE : mutedColor }]}>{lang}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            }
          />
        </SettingsSection>

        <SettingsSection title={t("securityAndAlerts")} cardBg={cardBg} dividerColor={dividerColor} shadowColor={isDarkMode ? "#000" : GREEN}>
          <SettingRow {...rowTheme} icon="notifications-active" title={t("pushNotifications")} subtitle={t("pushNotificationsSub")}
            right={<ToggleSwitch isOn={pushNotifications} onColor={NAVY_TRACK_LIGHT} offColor={isDarkMode ? "#374151" : "#D1D5DB"} thumbOnStyle={{ backgroundColor: NAVY_BLUE }} thumbOffStyle={{ backgroundColor: "#9CA3AF" }} size="medium" onToggle={setPushNotifications} />}
          />
          <SettingRow {...rowTheme} icon="fingerprint" title={t("biometrics")} subtitle={t("biometricsSub")} last
            right={<ToggleSwitch isOn={biometrics} onColor={NAVY_TRACK_LIGHT} offColor={isDarkMode ? "#374151" : "#D1D5DB"} thumbOnStyle={{ backgroundColor: NAVY_BLUE }} thumbOffStyle={{ backgroundColor: "#9CA3AF" }} size="medium" onToggle={setBiometrics} />}
          />
        </SettingsSection>

        <SettingsSection title={t("systemData")} cardBg={cardBg} dividerColor={dividerColor} shadowColor={isDarkMode ? "#000" : GREEN}>
          <SettingRow {...rowTheme} icon="storage" title={t("clearCache")} subtitle={t("clearCacheSub")}
            onPress={() => showAlert({ title: t("cacheAlertTitle"), message: t("cacheAlertMessage"), type: "success" })}
            right={<MaterialIcons name="chevron-right" size={20} color={chevronColor} />}
          />
          <SettingRow {...rowTheme} icon="gavel" title={t("termsAndPrivacy")} subtitle={t("termsAndPrivacySub")} last
            onPress={() => navigation.navigate("Termservice")}
            right={<MaterialIcons name="chevron-right" size={20} color={chevronColor} />}
          />
        </SettingsSection>

        <SettingsSection title={t("helpAndInfo")} cardBg={cardBg} dividerColor={dividerColor} shadowColor={isDarkMode ? "#000" : GREEN}>
          <SettingRow {...rowTheme} icon="support-agent" title={t("contactSupport")} subtitle={t("contactSupportSub")}
            onPress={() => navigation.navigate("Support")}
            right={<MaterialIcons name="chevron-right" size={20} color={chevronColor} />}
          />
          <SettingRow {...rowTheme} icon="info-outline" title={t("aboutApp")} subtitle={t("aboutAppSub")} last
            onPress={() => navigation.navigate("About")}
            right={<MaterialIcons name="chevron-right" size={20} color={chevronColor} />}
          />
        </SettingsSection>

        <View style={styles.footer}>
          <View style={styles.footerDivider}>
            <View style={[styles.footerLine, { backgroundColor: dividerColor }]} />
            <MaterialIcons name="sports-soccer" size={16} color={GOLD} style={{ marginHorizontal: 10 }} />
            <View style={[styles.footerLine, { backgroundColor: dividerColor }]} />
          </View>
          <Text style={[styles.footerVersion, { color: mutedColor }]}>Versão 1.2.4 (Build 42) · Engine Expo</Text>
          <Text style={[styles.footerCredit, { color: mutedColor }]}>
            Feito com muito carinho pela equipe{" "}
            <Text style={{ color: GREEN, fontWeight: "800" }}>Gol</Text>
            <Text style={{ color: GOLD, fontWeight: "800" }}>Up</Text>
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Hero verde escuro ───────────────────────────────────────────────────────
  hero: {
    backgroundColor: GREEN_DARK,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  stripe1: {
    position: "absolute", top: 0, bottom: 0, right: 60,
    width: 1, backgroundColor: "rgba(255,255,255,0.06)",
  },
  stripe2: {
    position: "absolute", top: 0, bottom: 0, right: 120,
    width: 1, backgroundColor: "rgba(255,255,255,0.04)",
  },
  heroInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heroTexts: { flex: 1 },
  heroEyebrow: {
    fontSize: 10, fontWeight: "600",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2,
  },
  heroTitle: {
    fontSize: 26, fontWeight: "900",
    letterSpacing: -0.3, lineHeight: 28,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  langSelector: { flexDirection: "row", borderRadius: 10, padding: 3, gap: 2 },
  langOption: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  langOptionActive: { backgroundColor: GREEN },
  langText: { fontSize: 11, fontWeight: "700" },
  footer: { alignItems: "center", marginTop: 8, gap: 6 },
  footerDivider: { flexDirection: "row", alignItems: "center", marginBottom: 4, width: "60%" },
  footerLine: { flex: 1, height: 1 },
  footerVersion: { fontSize: 11, fontWeight: "500" },
  footerCredit: { fontSize: 12, fontWeight: "600" },
});