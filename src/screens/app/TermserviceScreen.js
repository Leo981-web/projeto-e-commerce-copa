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
import { useLanguage } from "../../context/LanguageContext";

const GREEN = "#15622A";
const GREEN_MID = "#22C55E";
const GREEN_DARK = "#0D4A1A";
const GOLD = "#F5C518";
const WHITE = "#FFFFFF";

const getSections = (t) => [
  {
    icon: "sports-soccer",
    title: t("termsSectionTitle1") || "1. Aceitação dos Termos",
    body:
      t("termsSectionBody1") ||
      "Ao utilizar o GolUp, você confirma que leu, compreendeu e concorda com estes Termos de Uso. Se não concordar com qualquer disposição, pedimos que não utilize o aplicativo.",
  },
  {
    icon: "person",
    title: t("termsSectionTitle2") || "2. Cadastro e Conta",
    body:
      t("termsSectionBody2") ||
      "Para acessar funcionalidades completas, é necessário criar uma conta com informações verdadeiras e atualizadas. Você é responsável pela confidencialidade da sua senha e por todas as atividades realizadas em sua conta.",
  },
  {
    icon: "shopping-bag",
    title: t("termsSectionTitle3") || "3. Uso da Plataforma",
    body:
      t("termsSectionBody3") ||
      "O GolUp é uma plataforma de e-commerce temática da Copa do Mundo 2026. É proibido utilizar o aplicativo para fins ilícitos, fraudulentos ou que violem direitos de terceiros.",
  },
  {
    icon: "lock",
    title: t("termsSectionTitle4") || "4. Privacidade e Dados",
    body:
      t("termsSectionBody4") ||
      "Coletamos apenas os dados necessários para o funcionamento do serviço: nome, e-mail e telefone. Nunca vendemos suas informações a terceiros. Os dados são armazenados com criptografia e de acordo com a Lei Geral de Proteção de Dados (LGPD).",
  },
  {
    icon: "local-offer",
    title: t("termsSectionTitle5") || "5. Produtos e Preços",
    body:
      t("termsSectionBody5") ||
      "Os preços exibidos são em Reais (BRL) e podem ser alterados sem aviso prévio. O GolUp se reserva o direito de cancelar pedidos em caso de erros de cadastro ou esgotamento de estoque.",
  },
  {
    icon: "security",
    title: t("termsSectionTitle6") || "6. Segurança",
    body:
      t("termsSectionBody6") ||
      "Utilizamos protocolos de segurança para proteger suas informações. Mesmo assim, nenhum system é 100% inviolável. Recomendamos não compartilhar sua senha com ninguém.",
  },
  {
    icon: "update",
    title: t("termsSectionTitle7") || "7. Alterações nos Termos",
    body:
      t("termsSectionBody7") ||
      "Reservamo-nos o direito de modificar estes termos a qualquer momento. Você será notificado sobre mudanças significativas pelo e-mail cadastrado ou via notificação no app.",
  },
];

function TermSection({ item, index, theme }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <View
      style={[
        sec.wrap,
        { backgroundColor: theme.card, borderColor: theme.divider },
      ]}
    >
      <TouchableOpacity
        style={sec.header}
        activeOpacity={0.7}
        onPress={() => setOpen((p) => !p)}
      >
        <View style={[sec.iconWrap, { backgroundColor: theme.iconBg }]}>
          <MaterialIcons name={item.icon} size={18} color={theme.navActive} />
        </View>
        <Text style={[sec.title, { color: theme.textPrimary }]}>
          {item.title}
        </Text>
        <MaterialIcons
          name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={22}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {open && (
        <View style={sec.body}>
          <View style={[sec.accent, { backgroundColor: theme.navActive }]} />
          <Text style={[sec.bodyText, { color: theme.textPrimary }]}>
            {item.body}
          </Text>
        </View>
      )}
    </View>
  );
}

const sec = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: { flex: 1, fontSize: 13, fontWeight: "800" },
  body: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  accent: { width: 3, borderRadius: 2, alignSelf: "stretch", flexShrink: 0 },
  bodyText: { flex: 1, fontSize: 13, lineHeight: 20 },
});

export default function TermsOfServiceScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLanguage(); // Hook injetado corretamente

  const sectionsList = getSections(t);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN_DARK} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.stripe1} pointerEvents="none" />
        <View style={styles.stripe2} pointerEvents="none" />

        <View style={styles.heroTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color={WHITE} />
          </TouchableOpacity>
          <View style={styles.heroTexts}>
            <Text style={styles.heroTitle}>
              <Text style={{ color: GOLD }}>{t("termsTitle")}</Text>
              {" " + t("termsAndPrivacySubTitle")}
            </Text>
          </View>
        </View>

        <View style={styles.heroChips}>
          <View style={styles.chip}>
            <MaterialIcons
              name="calendar-today"
              size={11}
              color="rgba(255,255,255,0.75)"
            />
            <Text style={styles.chipText}>
              {t("termsEffectiveDate") || "Vigência: Jan 2026"}
            </Text>
          </View>
          <View style={styles.chip}>
            <MaterialIcons
              name="verified-user"
              size={11}
              color="rgba(255,255,255,0.75)"
            />
            <Text style={styles.chipText}>
              {t("termsLgpdCompliance") || "LGPD Conformidade"}
            </Text>
          </View>
        </View>
      </View>

      {/* ── BADGE DE RESUMO ──────────────────────────────────────────────────── */}
      <View style={styles.summaryBar}>
        <MaterialIcons name="info-outline" size={16} color={GREEN} />
        <Text style={styles.summaryText}>
          {t("termsSummaryInstruction") ||
            "Toque em cada seção para expandir e ler os detalhes."}
        </Text>
      </View>

      {/* ── SEÇÕES EXPANSÍVEIS ───────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {sectionsList.map((item, idx) => (
          <TermSection key={item.title} item={item} index={idx} theme={theme} />
        ))}

        {/* ── RODAPÉ ─────────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider}>
            <View
              style={[styles.footerLine, { backgroundColor: theme.divider }]}
            />
            <MaterialIcons
              name="sports-soccer"
              size={14}
              color={GOLD}
              style={{ marginHorizontal: 8 }}
            />
            <View
              style={[styles.footerLine, { backgroundColor: theme.divider }]}
            />
          </View>

          <View
            style={[
              styles.contactCard,
              { backgroundColor: theme.card, borderColor: theme.divider },
            ]}
          >
            <MaterialIcons name="mail-outline" size={20} color={GREEN} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactTitle, { color: theme.textPrimary }]}>
                {t("termsPrivacyQuestion") || "Dúvidas sobre privacidade?"}
              </Text>
              <Text style={styles.contactSub}>privacidade@golup.com.br</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: {
    backgroundColor: GREEN_DARK,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  stripe1: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 60,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  stripe2: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 120,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
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
  heroTexts: { flex: 1 },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: WHITE,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  heroChips: { flexDirection: "row", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.80)",
  },
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(21,98,42,0.07)",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.15)",
  },
  summaryText: {
    flex: 1,
    fontSize: 12,
    color: GREEN,
    fontWeight: "600",
    lineHeight: 16,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  footer: { marginTop: 10, alignItems: "center", gap: 10 },
  footerDivider: { flexDirection: "row", alignItems: "center", width: "70%" },
  footerLine: { flex: 1, height: 1 },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
    borderWidth: 1.5,
  },
  contactTitle: { fontSize: 13, fontWeight: "700" },
  contactSub: { fontSize: 12, color: GREEN, fontWeight: "600", marginTop: 1 },
});
