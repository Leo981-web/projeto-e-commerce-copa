import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { useCustomAlert } from "../../context/CustomAlertContext";

// Paletas de Cores de cada Tema
const PALETTES = {
  dark: {
    bg: "#121214",
    card: "#1A1A1E",
    textPrimary: "#FFFFFF",
    titlePrimary: "#fff",
    textMuted: "#A1A1AA",
    divider: "#27272A",
    iconBg: "#27272A",
    iconDestructiveBg: "#3A1E1E",
    textDestructive: "#f87171",
    navActive: "#FFFFFF",
    navInactive: "#52525b",
    statusBar: "light-content",
  },
  light: {
    bg: "#F5F1E8", 
    card: "#FFFFFF",
    textPrimary: "#20242c",
    titlePrimary: "#1A237E",
    textMuted: "#888888",
    divider: "#F5F1E8",
    iconBg: "#EEF2FF",
    iconDestructiveBg: "#FFF0ED",
    textDestructive: "#b42318",
    navActive: "#1A237E", 
    navInactive: "#bbb",
    statusBar: "dark-content",
  }
};

const WHITE = "#FFFFFF";
const NAVY_BLUE = "#1A237E";
const NAVY_TRACK_LIGHT = "#C5CAE9"; // Azul claro translúcido para o trilho ativo

const NAV_ITEMS = [
  { key: "home",      icon: "home",           iconOff: "home-outline",        label: "Início"   },
  { key: "favorites", icon: "heart",          iconOff: "heart-outline",       label: "Favoritos" },
  { key: "create",    icon: "add",            center: true                                       },
  { key: "cart",      icon: "cart",           iconOff: "cart-outline",        label: "Carrinho" },
  { key: "profile",   icon: "person",         iconOff: "person-outline",      label: "Perfil"   },
];

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const { showAlert, showConfirm } = useCustomAlert();
  const [activeNav, setActiveNav] = useState("");

  // Estados de Configuração
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("PT");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const theme = isDarkMode ? PALETTES.dark : PALETTES.light;

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      showAlert({ title: "Erro ao sair", message: error.message, type: "danger" });
    }
  }

  function confirmLogout() {
    showConfirm({
      title: "Sair do aplicativo",
      message: "Sua sessão será encerrada. Deseja continuar?",
      confirmText: "Sair",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: handleLogout,
    });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>Preferências Globais</Text>
        
        <View style={styles.headerTitleRow}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={24} color={theme.titlePrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.titlePrimary }]}>AJUSTES</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SEÇÃO: INTERFACE E APARÊNCIA */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Aparência e Idioma</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.divider }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name={isDarkMode ? "dark-mode" : "light-mode"} size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Tema Escuro</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>Adaptar interface para ambientes escuros</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#3f3f46", true: NAVY_TRACK_LIGHT }}
              thumbColor={isDarkMode ? NAVY_BLUE : "#71717a"}
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="g-translate" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Idioma do App</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>Alterar textos e moedas</Text>
            </View>
            
            <View style={[styles.langSelector, { backgroundColor: theme.iconBg }]}>
              {["PT", "EN", "ES"].map((lang) => {
                const isSelected = currentLanguage === lang;
                return (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.langOption, 
                      isSelected && { backgroundColor: isDarkMode ? WHITE : theme.navActive }
                    ]}
                    onPress={() => setCurrentLanguage(lang)}
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
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Segurança e Alertas</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.divider }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="notifications-active" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Notificações Push</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>Avisos de novos produtos e estoque</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#3f3f46", true: NAVY_TRACK_LIGHT }}
              thumbColor={pushNotifications ? NAVY_BLUE : "#71717a"}
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="fingerprint" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Biometria / Face ID</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>Acessar o app de forma mais segura</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: "#3f3f46", true: NAVY_TRACK_LIGHT }}
              thumbColor={biometrics ? NAVY_BLUE : "#71717a"}
            />
          </View>

        </View>

        {/* SEÇÃO: ARMAZENAMENTO E DADOS */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Dados do Sistema</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: theme.divider }]} 
            activeOpacity={0.7}
            onPress={() => showAlert({ title: "Cache", message: "Cache limpo com sucesso!", type: "success" })}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
              <MaterialIcons name="storage" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Limpar Cache</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>Libera espaço ocupado por imagens temporárias</Text>
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
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Termos e Privacidade</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>Políticas de uso dos dados</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>

        </View>

        {/* SEÇÃO: CONTA / SAÍDA */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Sessão</Text>
        <View style={[styles.optionsBlock, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" }]}>
          
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={confirmLogout}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconDestructiveBg }]}>
              <MaterialIcons name="logout" size={22} color={theme.textDestructive} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textDestructive }]}>Sair da Conta</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>Desconectar seu usuário do dispositivo</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, { color: isDarkMode ? "#4b5563" : "#bbb" }]}>
          Versão do App: 1.2.4 (Build 42) • Engine Expo
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
              if (tab.key === "home") navigation.navigate("ProductList");
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
                  {tab.label}
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