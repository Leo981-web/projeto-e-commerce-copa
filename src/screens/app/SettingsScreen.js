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
import { useTheme } from "../../context/ThemeContext"; // 1. Importado o contexto global de tema
import ToggleSwitch from "toggle-switch-react-native";

const WHITE = "#FFFFFF";
const NAVY_BLUE = "#1A237E";
const NAVY_TRACK_LIGHT = "#C5CAE9"; 

const NAV_ITEMS = [
  { key: "home",       icon: "home",           iconOff: "home-outline",        labelKey: "navHome"      },
  { key: "favorites", icon: "heart",          iconOff: "heart-outline",       labelKey: "navFavorites" },
  { key: "create",    icon: "add",            center: true                                             },
  { key: "cart",      icon: "cart",           iconOff: "cart-outline",        labelKey: "navCart"      },
  { key: "profile",   icon: "person",         iconOff: "person-outline",      labelKey: "navProfile"   },
];

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const { showAlert, showConfirm } = useCustomAlert();
  const { t, locale, changeLanguage } = useLanguage();
  
  // 2. Substituídos os useStates locais de tema pelas propriedades globais
  const { isDarkMode, theme, toggleTheme } = useTheme(); 
  
  const [activeNav, setActiveNav] = useState("");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      showAlert({ title: t("logoutErrorTitle"), message: error.message, type: "danger" });
    }
  }

  function confirmLogout() {
    showConfirm({
      title: t("logoutAlertTitle"),
      message: t("logoutAlertMessage"),
      confirmText: t("logoutConfirm"),
      cancelText: t("cancel"),
      type: "danger",
      onConfirm: handleLogout,
    });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>{t("globalPreferences")}</Text>
        
        <View style={styles.headerTitleRow}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={24} color={theme.titlePrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.titlePrimary }]}>{t("settingsTitle")}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SEÇÃO: INTERFACE E APARÊNCIA */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{t("appearanceAndLanguage")}</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.divider }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name={isDarkMode ? "dark-mode" : "light-mode"} size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{t("darkTheme")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("darkThemeSub")}</Text>
            </View>
            {/* 3. Ajustado para disparar o toggleTheme global */}
            <ToggleSwitch
              isOn={isDarkMode}
              onColor={NAVY_TRACK_LIGHT}
              offColor="#3f3f46"
              thumbOnStyle={{ backgroundColor: NAVY_BLUE }}
              thumbOffStyle={{ backgroundColor: "#71717a" }}
              size="medium"
              onToggle={toggleTheme} 
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="g-translate" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{t("appLanguage")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("appLanguageSub")}</Text>
            </View>
            
            <View style={[styles.langSelector, { backgroundColor: theme.iconBg }]}>
              {["PT", "EN", "ES"].map((lang) => {
                const isSelected = locale === lang;
                return (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.langOption, 
                      isSelected && { backgroundColor: isDarkMode ? WHITE : theme.navActive }
                    ]}
                    onPress={() => changeLanguage(lang)}
                  >
                    <Text style={[
                      styles.langText, 
                      { color: isSelected ? (isDarkMode ? "#121214" : WHITE) : theme.textMuted }
                    ]}>
                      {lang}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* SEÇÃO: NOTIFICAÇÕES E PRIVACIDADE */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{t("securityAndAlerts")}</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.divider }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="notifications-active" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{t("pushNotifications")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("pushNotificationsSub")}</Text>
            </View>
            <ToggleSwitch
              isOn={pushNotifications}
              onColor={NAVY_TRACK_LIGHT}
              offColor="#3f3f46"
              thumbOnStyle={{ backgroundColor: NAVY_BLUE }}
              thumbOffStyle={{ backgroundColor: "#71717a" }}
              size="medium"
              onToggle={setPushNotifications}
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="fingerprint" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{t("biometrics")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("biometricsSub")}</Text>
            </View>
            <ToggleSwitch
              isOn={biometrics}
              onColor={NAVY_TRACK_LIGHT}
              offColor="#3f3f46"
              thumbOnStyle={{ backgroundColor: NAVY_BLUE }}
              thumbOffStyle={{ backgroundColor: "#71717a" }}
              size="medium"
              onToggle={setBiometrics}
            />
          </View>
        </View>

        {/* SEÇÃO: ARMAZENAMENTO E DADOS */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{t("systemData")}</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: theme.divider }]} 
            activeOpacity={0.7}
            onPress={() => showAlert({ title: t("cacheAlertTitle"), message: t("cacheAlertMessage"), type: "success" })}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="storage" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{t("clearCache")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("clearCacheSub")}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingRow, styles.settingRowLast]} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate("TermsOfService")}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="gavel" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{t("termsAndPrivacy")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("termsAndPrivacySub")}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* SEÇÃO: AJUDA E INFORMAÇÕES */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{t("helpAndInfo")}</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: theme.divider }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Support")}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="support-agent" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{t("contactSupport")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("contactSupportSub")}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowLast]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("About")}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="info-outline" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{t("aboutApp")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("aboutAppSub")}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* SEÇÃO: CONTA / SAÍDA */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{t("session")}</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>
          
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={confirmLogout}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconDestructiveBg }]}>
              <MaterialIcons name="logout" size={22} color={theme.textDestructive} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textDestructive }]}>{t("logout")}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{t("logoutSub")}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, { color: isDarkMode ? "#4b5563" : "#bbb" }]}>
          {t("appVersionPrefix")} 1.2.4 (Build 42) • Engine Expo
        </Text>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={[styles.bottomNav, { backgroundColor: theme.card }]}>
        {NAV_ITEMS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, tab.center && styles.navItemCenter]}
            onPress={() => {
              setActiveNav(tab.key);
              if (tab.center) navigation.navigate("ProductCreate");
              if (tab.key === "home") navigation.navigate("Products");
              if (tab.key === "cart") navigation.navigate("Cart");
              if (tab.key === "profile") navigation.navigate("Profile");
            }}
          >
            {tab.center ? (
              <View style={[styles.navCreateBtn, { borderColor: theme.card, backgroundColor: NAVY_BLUE, shadowColor: NAVY_BLUE }]}>
                <Ionicons name="add" size={28} color={WHITE} />
              </View>
            ) : (
              <>
                <Ionicons
                  name={activeNav === tab.key ? tab.icon : tab.iconOff}
                  size={22}
                  color={activeNav === tab.key ? theme.navActive : theme.navInactive}
                />
                <Text style={[
                  styles.navLabel, 
                  { color: theme.navInactive },
                  activeNav === tab.key && { color: theme.navActive, fontWeight: "700" }
                ]}>
                  {t(tab.labelKey)}
                </Text>
                {activeNav === tab.key && <View style={[styles.navDot, { backgroundColor: theme.navActive }]} />}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 130, 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
    marginLeft: 2,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
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
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 12,
  },
  optionsBlock: {
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 8,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  settingSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  langSelector: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  langOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  langText: {
    fontSize: 11,
    fontWeight: "700",
  },
  versionText: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 16,
    marginBottom: 8,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  navItemCenter: {
    marginTop: -28,
  },
  navCreateBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});