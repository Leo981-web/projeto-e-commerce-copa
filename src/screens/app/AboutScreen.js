import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useCustomAlert } from "../../context/CustomAlertContext";

const GREEN = "#15622A";
const GOLD = "#F5C518";
const WHITE = "#FFFFFF";

const TEAM_MEMBERS = [
  {
    name: "Artur Machado Ibãnez",
    linkedinUrl: "https://www.linkedin.com/in/artur-machado-ibanez-876332359/",
  },
  {
    name: "Jamile Rockenbach Ferreira",
    linkedinUrl: "https://www.linkedin.com/in/jamile-rockenbach-ferreira/",
  },
  {
    name: "Kauê Saggiorato",
    linkedinUrl: "https://www.linkedin.com/in/kau%C3%AAsaggiorato/",
  },
  {
    name: "Leonardo Manfroi Zancanaro",
    linkedinUrl: "https://www.linkedin.com/in/leonardo-manfroi-zancanaro/",
  },
  {
    name: "Maria Luiza Pereto",
    linkedinUrl: "https://www.linkedin.com/in/malup/",
  },
  {
    name: "Maria Eduarda Laimer",
    linkedinUrl: "https://www.linkedin.com/in/maria-laimer/",
  },
  {
    name: "Tino Markus Navarro",
    linkedinUrl: "https://www.linkedin.com/in/tino-markus-bueno-navarro/",
  },
];

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_PALETTES = [
  { bg: "#D4EDDA", text: GREEN },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FEE2E2", text: "#991B1B" },
  { bg: "#D1FAE5", text: "#065F46" },
];

export default function AboutScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { showAlert } = useCustomAlert();

  const screenBg = theme.bg;
  const cardBg = theme.card;
  const textColor = theme.textPrimary;
  const mutedColor = theme.textMuted;
  const dividerColor = theme.divider;

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
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={cardBg}
      />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.header,
          { backgroundColor: cardBg, borderBottomColor: dividerColor },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backBtn,
            { backgroundColor: theme.iconBg, borderColor: dividerColor },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="chevron-back" size={22} color={textColor} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerEyebrow, { color: mutedColor }]}>
            {t("aboutHeaderSub")}
          </Text>
          <Text style={[styles.headerTitle, { color: GOLD }]}>
            {t("aboutTitle")}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── HERO CARD ──────────────────────────────────────────────────────── */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: cardBg, borderColor: dividerColor },
          ]}
        >
          <View style={styles.heroStripe}>
            <View style={[styles.stripeSegment, { backgroundColor: GREEN }]} />
            <View style={[styles.stripeSegment, { backgroundColor: GOLD }]} />
            <View
              style={[styles.stripeSegment, { backgroundColor: "#1a2696" }]}
            />
          </View>
          <View style={styles.heroLogoRow}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.heroAppName}>
                <Text style={{ color: GREEN }}>Gol</Text>
                <Text style={{ color: GOLD }}>Up</Text>
              </Text>
              <Text style={[styles.heroTagline, { color: mutedColor }]}>
                {t("aboutAppTagline")}
              </Text>
            </View>
          </View>
          <View
            style={[styles.heroDivider, { backgroundColor: dividerColor }]}
          />
          <Text style={[styles.heroDescription, { color: textColor }]}>
            {t("aboutAppDescription")}
          </Text>
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statBadge,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(21,98,42,0.2)"
                    : "#D4EDDA",
                },
              ]}
            >
              <MaterialIcons name="sports-soccer" size={22} color={GREEN} />
              <Text style={[styles.statLabel, { color: GREEN }]}>
                Copa 2026
              </Text>
            </View>
            <View
              style={[
                styles.statBadge,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(30,64,175,0.2)"
                    : "#DBEAFE",
                },
              ]}
            >
              <MaterialIcons name="shopping-bag" size={22} color="#1E40AF" />
              <Text style={[styles.statLabel, { color: "#1E40AF" }]}>
                E-commerce
              </Text>
            </View>
          </View>
        </View>

        {/* ── EQUIPE ─────────────────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionAccent, { backgroundColor: GOLD }]} />
          <View>
            <Text style={[styles.sectionTitle, { color: GREEN }]}>
              {t("aboutTeamTitle")}
            </Text>
            <Text style={[styles.sectionSub, { color: mutedColor }]}>
              {t("aboutTeamSub")}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.teamCard,
            { backgroundColor: cardBg, borderColor: dividerColor },
          ]}
        >
          {TEAM_MEMBERS.map((member, index) => {
            const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];
            const isLast = index === TEAM_MEMBERS.length - 1;
            return (
              <View
                key={member.name}
                style={[
                  styles.memberRow,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: dividerColor,
                  },
                ]}
              >
                <View style={[styles.avatar, { backgroundColor: palette.bg }]}>
                  <Text style={[styles.avatarText, { color: palette.text }]}>
                    {initials(member.name)}
                  </Text>
                </View>
                <Text
                  style={[styles.memberName, { color: textColor }]}
                  numberOfLines={1}
                >
                  {member.name}
                </Text>
                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => openLinkedin(member.linkedinUrl)}
                  style={styles.linkedinBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-linkedin" size={20} color={WHITE} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* ── RODAPÉ ─────────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider}>
            <View
              style={[styles.footerLine, { backgroundColor: dividerColor }]}
            />
            <MaterialIcons
              name="sports-soccer"
              size={16}
              color={GOLD}
              style={{ marginHorizontal: 10 }}
            />
            <View
              style={[styles.footerLine, { backgroundColor: dividerColor }]}
            />
          </View>
          <Text style={[styles.footerVersion, { color: mutedColor }]}>
            Versão 1.2.4 (Build 42) · Engine Expo
          </Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  headerCenter: { flex: 1 },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: "900", letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  heroCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    marginBottom: 24,
    elevation: 3,
  },
  heroStripe: { flexDirection: "row", height: 5 },
  stripeSegment: { flex: 1 },
  heroLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  heroLogo: { width: 56, height: 56 },
  heroAppName: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  heroTagline: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  heroDivider: { height: 1, marginHorizontal: 20, marginBottom: 14 },
  heroDescription: {
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statBadge: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionAccent: { width: 4, height: 36, borderRadius: 2 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionSub: { fontSize: 11, marginTop: 1 },
  teamCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    marginBottom: 24,
    elevation: 2,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 13, fontWeight: "800" },
  memberName: { flex: 1, fontSize: 13, fontWeight: "700" },
  linkedinBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#0A66C2",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { alignItems: "center", gap: 6 },
  footerDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    marginBottom: 4,
  },
  footerLine: { flex: 1, height: 1 },
  footerVersion: { fontSize: 11, fontWeight: "500" },
  footerCredit: { fontSize: 12, fontWeight: "600" },
});
