import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const GREEN      = "#15622A";
const GREEN_MID  = "#22C55E";
const GREEN_DARK = "#0D4A1A";
const GOLD       = "#F5C518";
const WHITE      = "#FFFFFF";

// ── Conteúdo das seções ────────────────────────────────────────────────────
const SECTIONS = [
  {
    icon: "sports-soccer",
    color: GREEN,
    bg: "#D4EDDA",
    title: "1. Aceitação dos Termos",
    body:
      "Ao utilizar o GolUp, você confirma que leu, compreendeu e concorda com estes Termos de Uso. Se não concordar com qualquer disposição, pedimos que não utilize o aplicativo.",
  },
  {
    icon: "person",
    color: "#1E40AF",
    bg: "#DBEAFE",
    title: "2. Cadastro e Conta",
    body:
      "Para acessar funcionalidades completas, é necessário criar uma conta com informações verdadeiras e atualizadas. Você é responsável pela confidencialidade da sua senha e por todas as atividades realizadas em sua conta.",
  },
  {
    icon: "shopping-bag",
    color: "#92400E",
    bg: "#FEF3C7",
    title: "3. Uso da Plataforma",
    body:
      "O GolUp é uma plataforma de e-commerce temática da Copa do Mundo 2026. É proibido utilizar o aplicativo para fins ilícitos, fraudulentos ou que violem direitos de terceiros.",
  },
  {
    icon: "lock",
    color: "#5B21B6",
    bg: "#EDE9FE",
    title: "4. Privacidade e Dados",
    body:
      "Coletamos apenas os dados necessários para o funcionamento do serviço: nome, e-mail e telefone. Nunca vendemos suas informações a terceiros. Os dados são armazenados com criptografia e de acordo com a Lei Geral de Proteção de Dados (LGPD).",
  },
  {
    icon: "local-offer",
    color: "#065F46",
    bg: "#D1FAE5",
    title: "5. Produtos e Preços",
    body:
      "Os preços exibidos são em Reais (BRL) e podem ser alterados sem aviso prévio. O GolUp se reserva o direito de cancelar pedidos em caso de erros de cadastro ou esgotamento de estoque.",
  },
  {
    icon: "security",
    color: "#991B1B",
    bg: "#FEE2E2",
    title: "6. Segurança",
    body:
      "Utilizamos protocolos de segurança para proteger suas informações. Mesmo assim, nenhum sistema é 100% inviolável. Recomendamos não compartilhar sua senha com ninguém.",
  },
  {
    icon: "update",
    color: "#9D174D",
    bg: "#FCE7F3",
    title: "7. Alterações nos Termos",
    body:
      "Reservamo-nos o direito de modificar estes termos a qualquer momento. Você será notificado sobre mudanças significativas pelo e-mail cadastrado ou via notificação no app.",
  },
];

// ── Componente de seção expansível ────────────────────────────────────────
function TermSection({ item, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <View style={sec.wrap}>
      <TouchableOpacity
        style={sec.header}
        activeOpacity={0.7}
        onPress={() => setOpen((p) => !p)}
      >
        <View style={[sec.iconWrap, { backgroundColor: item.bg }]}>
          <MaterialIcons name={item.icon} size={18} color={item.color} />
        </View>
        <Text style={sec.title} numberOfLines={1}>{item.title}</Text>
        <MaterialIcons
          name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={22}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {open && (
        <View style={sec.body}>
          <View style={[sec.accent, { backgroundColor: item.color }]} />
          <Text style={sec.bodyText}>{item.body}</Text>
        </View>
      )}
    </View>
  );
}

const sec = StyleSheet.create({
  wrap: {
    backgroundColor: WHITE,
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.10)",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
    width: 36, height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  body: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  accent: {
    width: 3,
    borderRadius: 2,
    alignSelf: "stretch",
    flexShrink: 0,
  },
  bodyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#374151",
  },
});

// ── Tela principal ─────────────────────────────────────────────────────────
export default function TermsOfServiceScreen({ navigation }) {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN_DARK} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        {/* Listras decorativas */}
        <View style={styles.stripe1} pointerEvents="none" />
        <View style={styles.stripe2} pointerEvents="none" />

        {/* Linha: voltar + título */}
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
              <Text style={{ color: GOLD }}>Termos</Text>
              {" e Privacidade"}
            </Text>
          </View>
        </View>

        {/* Chips de info */}
        <View style={styles.heroChips}>
          <View style={styles.chip}>
            <MaterialIcons name="calendar-today" size={11} color="rgba(255,255,255,0.75)" />
            <Text style={styles.chipText}>Vigência: Jan 2026</Text>
          </View>
          <View style={styles.chip}>
            <MaterialIcons name="verified-user" size={11} color="rgba(255,255,255,0.75)" />
            <Text style={styles.chipText}>LGPD Conformidade</Text>
          </View>
        </View>
      </View>

      {/* ── BADGE DE RESUMO ──────────────────────────────────────────────────── */}
      <View style={styles.summaryBar}>
        <MaterialIcons name="info-outline" size={16} color={GREEN} />
        <Text style={styles.summaryText}>
          Toque em cada seção para expandir e ler os detalhes.
        </Text>
      </View>

      {/* ── SEÇÕES EXPANSÍVEIS ───────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {SECTIONS.map((item, idx) => (
          <TermSection key={item.title} item={item} index={idx} />
        ))}

        {/* ── RODAPÉ ─────────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          {/* Linha decorativa */}
          <View style={styles.footerDivider}>
            <View style={styles.footerLine} />
            <MaterialIcons name="sports-soccer" size={14} color={GOLD} style={{ marginHorizontal: 8 }} />
            <View style={styles.footerLine} />
          </View>

          {/* Card de contato */}
          <View style={styles.contactCard}>
            <MaterialIcons name="mail-outline" size={20} color={GREEN} />
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>Dúvidas sobre privacidade?</Text>
              <Text style={styles.contactSub}>privacidade@golup.com.br</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F7F1" },

  // ── Hero ───────────────────────────────────────────────────────────────────
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
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
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
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: WHITE,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  heroChips: {
    flexDirection: "row",
    gap: 8,
  },
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

  // ── Summary bar ────────────────────────────────────────────────────────────
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

  // ── Scroll ─────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // ── Rodapé ─────────────────────────────────────────────────────────────────
  footer: {
    marginTop: 10,
    alignItems: "center",
    gap: 10,
  },
  footerDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
  footerLine: {
    flex: 1, height: 1,
    backgroundColor: "rgba(21,98,42,0.12)",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
    borderWidth: 1.5,
    borderColor: "rgba(21,98,42,0.10)",
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  contactSub: {
    fontSize: 12,
    color: GREEN,
    fontWeight: "600",
    marginTop: 1,
  },
  footerCredit: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  footerVersion: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});