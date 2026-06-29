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
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1 },
  label: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 11.5, marginTop: 3, lineHeight: 15 },
});

// ─────────────────────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const { logout, user, isAdmin } = useAuth();
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

  const NAV_ITEMS = [
  { key: "home",      icon: "home",   iconOff: "home-outline",   labelKey: "navHome"      },
  { key: "favorites", icon: "heart",  iconOff: "heart-outline",  labelKey: "navFavorites" },
  { key: "create",    center: true,   adminOnly: true             },
  { key: "cart",      icon: "cart",   iconOff: "cart-outline",   labelKey: "navCart"      },
  { key: "profile",   icon: "person", iconOff: "person-outline", labelKey: "navProfile"   },
].filter((tab) => !tab.adminOnly || isAdmin);

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
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={screenBg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 110 }]}
      >
        {/* ── TOPO ──────────────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.topBarBackBtn, { backgroundColor: theme.iconBg }]}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: textColor }]}>{t("profileScreenTitle")}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* ── DADOS DO PERFIL, centralizados, sem bloco verde ───────────────── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={[styles.avatarCameraBtn, { borderColor: screenBg }]}>
              <MaterialIcons name="camera-alt" size={11} color={GREEN_DARK} />
            </View>
          </View>

          <Text style={[styles.profileName, { color: textColor }]}>{profileData.name}</Text>
          <Text style={[styles.profileEmail, { color: mutedColor }]}>{profileData.email}</Text>
          {profileData.phone ? (
            <Text style={[styles.profilePhone, { color: mutedColor }]}>{profileData.phone}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: theme.navActive }]}
            onPress={() => setEditVisible(true)}
            activeOpacity={0.85}
          >
            <MaterialIcons name="edit" size={14} color={WHITE} />
            <Text style={styles.editBtnText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* ── STATS card ────────────────────────────────────────────────────── */}
        <View style={[styles.statsCard, { backgroundColor: cardBg, borderColor: dividerColor }]}>
          {[
            { icon: "receipt-long", label: t("profileStatOrders"),    value: "0" },
            { icon: "favorite",     label: t("profileStatFavorites"), value: `${favorites?.length ?? 0}` },
            { icon: "star",         label: t("profileStatReviews"),   value: "0" },
          ].map((s, i, arr) => (
            <View
              key={s.label + i}
              style={[
                styles.statItem,
                i < arr.length - 1 && { borderRightWidth: 1, borderRightColor: dividerColor },
              ]}
            >
              <MaterialIcons name={s.icon} size={22} color={theme.navActive} />
              <Text style={[styles.statValue, { color: textColor }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: mutedColor }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── GRUPO: MINHA CONTA ───────────────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: mutedColor }]}>Minha conta</Text>
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
            iconColor={theme.navActive}
            iconBg={theme.iconBg}
            label={t("profileScreenAdress")}
            sub={t("profileScreenAdressText")}
            onPress={() => navigation.navigate("Addresses")}
          />
          <MenuItem
            {...rowTheme}
            icon="star-outline"
            iconColor={theme.navActive}
            iconBg={theme.iconBg}
            label={t("profileScreenMyReviews")}
            sub={t("profileScreenMyReviewsText")}
            onPress={() => navigation.navigate("Reviews")}
            last
          />
        </View>

        {/* ── GRUPO: SEGURANÇA ─────────────────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: mutedColor }]}>Segurança</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: dividerColor }]}>
          <MenuItem
            {...rowTheme}
            icon="lock-outline"
            iconColor={theme.navActive}
            iconBg={theme.iconBg}
            label={t("profileScreenResetPassword")}
            sub={t("profileScreenResetPasswordText")}
            onPress={() =>
              showAlert({
                title: t("successTitle"),
                message: t("passwordResetSent"),
                type: "success",
              })
            }
            last
          />
        </View>

        {/* ── SAIR ──────────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={18} color={WHITE} />
          <Text style={styles.logoutBtnText}>{t("profileScreenLogut")}</Text>
        </TouchableOpacity>
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
      <View style={[styles.bottomNav, { backgroundColor: theme.surfaceAccent, borderColor: dividerColor }]}>
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
              <View style={[styles.navCreateBtn, { borderColor: theme.surfaceAccent }]}>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    marginTop: 6,
  },
  topBarBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarWrap: { position: "relative", marginBottom: 16 },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(245,197,24,0.35)",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "900",
    color: GREEN_DARK,
  },
  avatarCameraBtn: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.2,
    lineHeight: 24,
    textAlign: "center",
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  profilePhone: {
    fontSize: 12,
    marginTop: 3,
    textAlign: "center",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 999,
    marginTop: 18,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: WHITE,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 0,
  },
  statsCard: {
    flexDirection: "row",
    borderRadius: 22,
    marginBottom: 28,
    overflow: "hidden",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    gap: 6,
  },
  statValue: {
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: 4,
    marginBottom: 24,
    borderRadius: 22,
    backgroundColor: RED,
    shadowColor: RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 2,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: WHITE,
  },
  card: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 28,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
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