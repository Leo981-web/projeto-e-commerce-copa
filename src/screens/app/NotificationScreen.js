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
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const GREEN      = "#15622A";
const GREEN_DARK = "#0D4A1A";
const GREEN_MID  = "#22C55E";
const GOLD       = "#F5C518";
const RED_LIVE   = "#EF4444";

// SOLUÇÃO: Mudamos o array para uma função que recebe 't' como argumento
const getNotifications = (t) => [
  {
    id: "1",
    icon: "favorite",
    iconLib: "material",
    iconBg: "#FEE2E2",
    iconColor: "#991B1B",
    tag: t("notificationsScreenTag1"), // Removido a interpolação desnecessária `${}`
    tagColor: GOLD,
    tagText: "#92400E",
    title: t("notificationsScreenTitle1"), // Ajuste as chaves conforme seu JSON
    body: t("notificationsScreenBody1"),
    time: t("notificationsScreenTime1"),
    unread: true,
  },
  {
    id: "2",
    icon: "local-offer",
    iconLib: "material",
    iconBg: "#D4EDDA",
    iconColor: GREEN,
    tag: t("notificationsScreenTag2"),
    tagColor: "#D4EDDA",
    tagText: GREEN,
    title: t("notificationsScreenTitle2"),
    body: t("notificationsScreenBody2"),
    time: t("notificationsScreenTime2"),
    unread: true,
  },
  {
    id: "3",
    icon: "sports-soccer",
    iconLib: "material",
    iconBg: "#DBEAFE",
    iconColor: "#1E40AF",
    tag: t("notificationsScreenTag3"),
    tagColor: "#DBEAFE",
    tagText: "#1E40AF",
    title: t("notificationsScreenTitle3"),
    body: t("notificationsScreenBody3"),
    time: t("notificationsScreenTime3"),
    unread: true,
  },
];

export default function NotificationsScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Geramos as notificações dinamicamente passando a função 't' ativa
  const notificationsList = getNotifications(t);
  const unreadCount = notificationsList.filter((n) => n.unread).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7F1" />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color={GREEN} />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>
            <Text style={{ color: GREEN }}>{t("notificationsScreenTitle")}</Text>
          </Text>
          {unreadCount > 0 && (
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{unreadCount} {t("notificationsScreenNew")}</Text>
            </View>
          )}
        </View>
        <Text style={styles.heroSub}>
          {unreadCount > 0
            ? `${t("notificationsScreenNotificationsUnread1")} ${unreadCount} ${t("notificationsScreenNotificationsUnread2")}`
            : t("notificationsScreenNotificationsUnread3")}
        </Text>
        <View style={styles.heroLine} />
      </View>

      {/* ── BARRA "AO VIVO" ─────────────────────────────────────────────── */}
      <View style={styles.statusBar}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{t("notificationsScreenCentraldeAvisos")}</Text>
        <View style={styles.statusSep} />
        <MaterialIcons name="notifications-active" size={12} color="rgba(255,255,255,0.65)" />
        <Text style={styles.statusSub}>{t("notificationsScreenAtualizadoAgora")}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── LABEL SEÇÃO ──────────────────────────────────────────────── */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionLabel}>{t("notificationsScreenTodasNotificações")}</Text>
        </View>

        {/* ── LISTA ────────────────────────────────────────────────────── */}
        {notificationsList.map((notif) => (
          <View
            key={notif.id}
            style={[
              styles.card,
              { backgroundColor: isDarkMode ? "#1C1F2A" : "#FFFFFF" },
              notif.unread && styles.cardUnread,
            ]}
          >
            {notif.unread && <View style={styles.unreadBar} />}

            <View style={[styles.iconWrap, { backgroundColor: notif.iconBg }]}>
              <MaterialIcons name={notif.icon} size={22} color={notif.iconColor} />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardTopRow}>
                <View style={[styles.tag, { backgroundColor: notif.tagColor }]}>
                  <Text style={[styles.tagText, { color: notif.tagText }]}>
                    {notif.tag}
                  </Text>
                </View>
                <Text style={styles.time}>{notif.time}</Text>
              </View>

              <Text style={[styles.cardTitle, { color: isDarkMode ? "#F3F4F6" : "#111827" }]}>
                {notif.title}
              </Text>
              <Text style={[styles.cardBody, { color: isDarkMode ? "#9CA3AF" : "#6B7280" }]}>
                {notif.body}
              </Text>
            </View>
          </View>
        ))}

        {/* ── RODAPÉ ───────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <MaterialIcons name="notifications-none" size={18} color="rgba(21,98,42,0.35)" />
          <Text style={styles.footerText}>{t("notificationsScreenFooter")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F0F7F1",
  },
  hero: {
    backgroundColor: "#F0F7F1",
    paddingTop: 16,
    paddingBottom: 0,
    paddingHorizontal: 20,
    gap: 10,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(21,98,42,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: "900",
    color: GREEN,
    letterSpacing: -0.5,
  },
  heroBadge: {
    backgroundColor: RED_LIVE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(21,98,42,0.55)",
    fontWeight: "600",
    marginLeft: 50,
    marginBottom: 16,
  },
  // Linha fina verde com sombra/luz verde embaixo
  heroLine: {
    height: 2,
    backgroundColor: GREEN,
    marginHorizontal: -20,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Barra de status ───────────────────────────────────────────────────────
  statusBar: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN_MID,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  statusSep: {
    width: 1,
    height: 13,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 2,
  },
  statusSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
  },

  // ── Conteúdo ──────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: GREEN,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: GREEN,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    gap: 12,
  },
  cardUnread: {
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.12)",
  },
  unreadBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: GREEN,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  time: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "400",
  },

  // ── Rodapé ────────────────────────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(21,98,42,0.45)",
    fontWeight: "600",
  },
});