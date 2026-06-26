import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoriteContext";

const GREEN      = "#15622A";
const GREEN_DARK = "#0A3214";
const GOLD       = "#F5C518";
const WHITE      = "#FFFFFF";
const RED        = "#EF4444";

const NAV_ITEMS = [
  { key: "home",      icon: "home",    iconOff: "home-outline",    labelKey: "navHome"      },
  { key: "favorites", icon: "heart",   iconOff: "heart-outline",   labelKey: "navFavorites" },
  { key: "create",    center: true },
  { key: "cart",      icon: "cart",    iconOff: "cart-outline",    labelKey: "navCart"      },
  { key: "profile",   icon: "person",  iconOff: "person-outline",  labelKey: "navProfile"   },
];

// ─── Modal de edição de perfil ─────────────────────────────────────────────
function EditProfileModal({ visible, onClose, user, onSave, theme, isDarkMode }) {
  const [name,  setName]  = useState(user?.name  ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const cardBg       = theme.card;
  const textColor    = theme.textPrimary;
  const mutedColor   = theme.textMuted;
  const inputBg      = isDarkMode ? "#0A3214" : "#F7F8FA";
  const inputBorder  = theme.divider;

  function Field({ label, icon, value, onChange, keyboard, placeholder }) {
    return (
      <View style={modalStyles.field}>
        <Text style={[modalStyles.fieldLabel, { color: mutedColor }]}>{label}</Text>
        <View style={[modalStyles.fieldInput, { backgroundColor: inputBg, borderColor: inputBorder }]}>
          <MaterialIcons name={icon} size={18} color={GREEN} style={{ marginRight: 10 }} />
          <TextInput
            style={[modalStyles.fieldText, { color: textColor }]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={mutedColor}
            keyboardType={keyboard ?? "default"}
            autoCapitalize="none"
          />
        </View>
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={modalStyles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[modalStyles.sheet, { backgroundColor: cardBg, borderColor: theme.divider, borderTopWidth: 1.5 }]}>
          <View style={[modalStyles.handle, { backgroundColor: theme.divider }]} />

          <Text style={[modalStyles.sheetTitle, { color: theme.navActive }]}>Editar Perfil</Text>
          <Text style={[modalStyles.sheetSub, { color: mutedColor }]}>Atualize suas informações pessoais</Text>

          <Field
            label="Nome completo"
            icon="person"
            value={name}
            onChange={setName}
            placeholder="Seu nome"
          />
          <Field
            label="E-mail"
            icon="email"
            value={email}
            onChange={setEmail}
            keyboard="email-address"
            placeholder="seu@email.com"
          />
          <Field
            label="Telefone"
            icon="phone"
            value={phone}
            onChange={setPhone}
            keyboard="phone-pad"
            placeholder="(00) 00000-0000"
          />

          <View style={modalStyles.sheetActions}>
            <TouchableOpacity
              style={[modalStyles.btnCancel, { borderColor: theme.divider }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[modalStyles.btnCancelText, { color: mutedColor }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.btnSave, { backgroundColor: theme.navActive }]}
              onPress={() => { onSave({ name, email, phone }); onClose(); }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check" size={16} color={WHITE} />
              <Text style={modalStyles.btnSaveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 12,
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 2,
  },
  fieldInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  sheetActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  btnCancel: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancelText: {
    fontSize: 14,
    fontWeight: "700",
  },
  btnSave: {
    flex: 2,
    flexDirection: "row",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnSaveText: {
    fontSize: 14,
    fontWeight: "800",
    color: WHITE,
  },
});

// ─── Linha de menu ─────────────────────────────────────────────────────────
function MenuItem({ icon, iconColor, iconBg, label, sub, textColor, mutedColor, dividerColor, last, onPress, danger }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        menuStyles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: dividerColor },
      ]}
    >
      <View style={[menuStyles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={menuStyles.textWrap}>
        <Text style={[menuStyles.label, { color: danger ? RED : textColor }]}>{label}</Text>
        {sub ? <Text style={[menuStyles.sub, { color: mutedColor }]}>{sub}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={20} color={danger ? RED : mutedColor} style={{ opacity: 0.7 }} />
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1 },
  label: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 11, marginTop: 2, lineHeight: 15 },
});

// ─────────────────────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const { logout, user } = useAuth();
  const { showAlert, showConfirm } = useCustomAlert();
  const { t } = useLanguage();
  const { isDarkMode, theme } = useTheme();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();

  const [activeNav, setActiveNav]   = useState("profile");
  const [editVisible, setEditVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name:  user?.name  ?? "Usuário",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  const screenBg     = theme.bg; 
  const cardBg       = theme.card;
  const textColor    = theme.textPrimary;
  const mutedColor   = theme.textMuted;
  const dividerColor = theme.divider;

  const initials = profileData.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

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

  const rowTheme = { textColor, mutedColor, dividerColor };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN_DARK} />

      {/* ── HERO HEADER verde ─────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroGrid} pointerEvents="none">
          {[...Array(8)].map((_, i) => (
            <View key={i} style={styles.heroGridLine} />
          ))}
        </View>

        <View style={styles.heroTop}>
          <TouchableOpacity
            style={styles.heroBackBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color={WHITE} />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>{t("profileScreenTitle")}</Text>
          <TouchableOpacity
            style={styles.heroEditBtn}
            onPress={() => setEditVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="edit" size={16} color={WHITE} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroInfo}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.avatarCameraBtn}>
              <MaterialIcons name="camera-alt" size={11} color={GREEN_DARK} />
            </View>
          </View>

          <View style={styles.heroUserInfo}>
            <Text style={styles.heroName}>{profileData.name.toUpperCase()}</Text>
            <Text style={styles.heroEmail}>{profileData.email}</Text>
            {profileData.phone ? (
              <Text style={styles.heroPhone}>{profileData.phone}</Text>
            ) : null}
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>🇧🇷 {t("profileFanText")}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 110 }]}
      >
        {/* ── STATS card flutuante ─────────────────────────────────────────── */}
        <View style={[styles.statsCard, { backgroundColor: cardBg, borderColor: dividerColor }]}>
          {[
            { icon: "receipt-long", label: t("profileScreenOrders"),     value: "0",                     color: GOLD   },
            { icon: "favorite",     label: t("profileScreenFavorites"),  value: `${favorites?.length ?? 0}`, color: RED    },
            { icon: "star",         label: t("profileScreenFavorites"), value: "0",                     color: "#FBBF24" },
          ].map((s, i, arr) => (
            <View
              key={s.label + i}
              style={[
                styles.statItem,
                i < arr.length - 1 && { borderRightWidth: 1, borderRightColor: dividerColor },
              ]}
            >
              <MaterialIcons name={s.icon} size={22} color={s.color} />
              <Text style={[styles.statValue, { color: textColor }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: mutedColor }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── MENU PRINCIPAL ───────────────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: dividerColor }]}>
          <MenuItem
            {...rowTheme}
            icon="history"
            iconColor={theme.navActive}
            iconBg={theme.iconBg}
            label={t("profileScreenOrderHistory")}
            sub={t("profileScreenOrderHistoryText")}
            onPress={() => navigation.navigate("History")}
          />
          <MenuItem
            {...rowTheme}
            icon="location-on"
            iconColor="#3B82F6"
            iconBg={isDarkMode ? "rgba(59,130,246,0.15)" : "#DBEAFE"}
            label={t("profileScreenAdress")}
            sub={t("profileScreenAdressText")}
            onPress={() => navigation.navigate("Addresses")}
          />
          <MenuItem
            {...rowTheme}
            icon="lock-outline"
            iconColor="#8B5CF6"
            iconBg={isDarkMode ? "rgba(139,92,246,0.15)" : "#EDE9FE"}
            label={t("profileScreenResetPassword")}
            sub={t("profileScreenResetPasswordText")}
            onPress={() => navigation.navigate("ChangePassword")}
          />
          <MenuItem
            {...rowTheme}
            icon="star-outline"
            iconColor="#FBBF24"
            iconBg={isDarkMode ? "rgba(245,197,24,0.15)" : "#FEF3C7"}
            label={t("profileScreenMyReviews")}
            sub={t("profileScreenMyReviewsText")}
            onPress={() => navigation.navigate("Reviews")}
          />
          <MenuItem
            {...rowTheme}
            icon="logout"
            iconColor={RED}
            iconBg={theme.iconDestructiveBg}
            label={t("profileScreenLogut")}
            sub={t("profileScreenLogoutText")}
            onPress={confirmLogout}
            last
            danger
          />
        </View>
      </ScrollView>

      {/* ── MODAL EDITAR PERFIL ───────────────────────────────────────────── */}
      <EditProfileModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        user={profileData}
        onSave={(data) => setProfileData((prev) => ({ ...prev, ...data }))}
        theme={theme}
        isDarkMode={isDarkMode}
      />

      {/* ── BOTTOM NAV ───────────────────────────────────────────────────── */}
      <View style={[styles.bottomNav, { backgroundColor: cardBg, borderColor: dividerColor }]}>
        {NAV_ITEMS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, tab.center && styles.navItemCenter]}
            onPress={() => {
              setActiveNav(tab.key);
              if (tab.key === "create")    navigation.navigate("ProductCreate");
              if (tab.key === "home")      navigation.navigate("Products");
              if (tab.key === "cart")      navigation.navigate("Cart");
              if (tab.key === "favorites") navigation.navigate("Favorites");
            }}
          >
            {tab.center ? (
              <View style={[styles.navCreateBtn, { borderColor: cardBg }]}>
                <Ionicons name="add" size={26} color={GREEN_DARK} />
              </View>
            ) : (
              <>
                <View style={[
                  styles.navIconWrap,
                  activeNav === tab.key && { backgroundColor: theme.iconBg },
                ]}>
                  <Ionicons
                    name={activeNav === tab.key ? tab.icon : tab.iconOff}
                    size={20}
                    color={activeNav === tab.key ? theme.navActive : theme.navInactive}
                  />
                  {tab.key === "cart" && totalItems > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{totalItems}</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.navLabel,
                  { color: theme.navInactive },
                  activeNav === tab.key && { color: theme.navActive, fontWeight: "800" },
                ]}>
                  {t(tab.labelKey)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 52,
    overflow: "hidden",
    backgroundColor: GREEN_DARK,
  },
  heroGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  heroGridLine: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.04)",
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  heroBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: WHITE,
    letterSpacing: 3,
  },
  heroEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(245,197,24,0.4)",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: GREEN_DARK,
  },
  avatarCameraBtn: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: GREEN_DARK,
  },
  heroUserInfo: { flex: 1 },
  heroName: {
    fontSize: 22,
    fontWeight: "900",
    color: WHITE,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  heroEmail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
    marginBottom: 2,
  },
  heroPhone: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 8,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: GOLD,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: GREEN_DARK,
    letterSpacing: 0.5,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  statsCard: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 5,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 26,
    paddingHorizontal: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navItemCenter: { marginTop: -16 },
  navIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  navCreateBtn: {
    width: 52, height: 52,
    borderRadius: 12,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  cartBadge: {
    position: "absolute",
    top: -4, right: -8,
    backgroundColor: RED,
    borderRadius: 10,
    minWidth: 16, height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: WHITE,
  },
  cartBadgeText: { color: WHITE, fontSize: 9, fontWeight: "bold" },
});