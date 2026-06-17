import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useCustomAlert } from "../../context/CustomAlertContext";

// Integrantes do grupo responsáveis pelo projeto
const TEAM_MEMBERS = [
  { name: "Maria Luiza Pereto", linkedinUrl: "https://www.linkedin.com/in/malup/" },
  { name: "Maria Eduarda Laimer", linkedinUrl: "https://www.linkedin.com/in/maria-laimer/" },
  { name: "Jamile Rockenbach Ferreira", linkedinUrl: "https://www.linkedin.com/in/jamile-rockenbach-ferreira/" },
  { name: "Leonardo Manfroi Zancanaro", linkedinUrl: "https://www.linkedin.com/in/leonardo-manfroi-zancanaro/" },
  { name: "Kauê Saggiorato", linkedinUrl: "https://www.linkedin.com/in/kau%C3%AAsaggiorato/" },
  { name: "Tino Markus Navarro", linkedinUrl: "https://www.linkedin.com/in/tino-markus-bueno-navarro/" },
  { name: "Artur Machado Ibãnez", linkedinUrl: "https://www.linkedin.com/in/artur-machado-ibanez-876332359/" },
];

export default function AboutScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { showAlert } = useCustomAlert();

  async function openLinkedin(url) {
    try {
      await Linking.openURL(url);
    } catch (error) {
      showAlert({
        title: t("opsTitle"),
        message: error.message,
        type: "danger",
      });
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
          {t("aboutHeaderSub")}
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
            {t("aboutTitle")}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CARD DO APP */}
        <View
          style={[
            styles.appCard,
            { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" },
          ]}
        >
          <View style={[styles.appIconWrap, { backgroundColor: theme.iconBg }]}>
            <Text style={styles.appIconEmoji}>🏆</Text>
          </View>
          <Text style={[styles.appName, { color: theme.titlePrimary }]}>
            {t("aboutAppName")}
          </Text>
          <Text style={[styles.appTagline, { color: theme.textMuted }]}>
            {t("aboutAppTagline")}
          </Text>
          <Text style={[styles.appDescription, { color: theme.textPrimary }]}>
            {t("aboutAppDescription")}
          </Text>
          <Text style={[styles.appVersion, { color: theme.textMuted }]}>
            {t("aboutVersionLabel")} 1.2.4
          </Text>
        </View>

        {/* EQUIPE */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          {t("aboutTeamTitle")}
        </Text>
        <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
          {t("aboutTeamSub")}
        </Text>

        <View
          style={[
            styles.optionsBlock,
            { backgroundColor: theme.card, shadowColor: isDarkMode ? "#000" : "#a39f96" },
          ]}
        >
          {TEAM_MEMBERS.map((member, index) => (
            <View
              key={member.name}
              style={[
                styles.memberRow,
                { borderBottomColor: theme.divider },
                index === TEAM_MEMBERS.length - 1 && styles.memberRowLast,
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
                <MaterialIcons name="person" size={20} color={theme.textPrimary} />
              </View>
              <Text
                style={[styles.memberName, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {member.name}
              </Text>
              <TouchableOpacity
                hitSlop={10}
                onPress={() => openLinkedin(member.linkedinUrl)}
                style={styles.linkedinButton}
              >
                <Ionicons name="logo-linkedin" size={22} color="#0A66C2" />
              </TouchableOpacity>
            </View>
          ))}
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
  appCard: {
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  appIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appIconEmoji: { fontSize: 30 },
  appName: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: "center",
  },
  appTagline: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 14,
  },
  appVersion: {
    fontSize: 11,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
    marginLeft: 4,
  },
  sectionSub: {
    fontSize: 12,
    marginBottom: 10,
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
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
  },
  memberRowLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  memberName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 12,
    marginRight: 8,
  },
  linkedinButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
