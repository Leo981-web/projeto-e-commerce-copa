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
  Pressable,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import * as authService from "../../services/authService";

const WHITE = "#FFFFFF";
const NAVY_BLUE = "#1A237E";

const NAV_ITEMS = [
  { key: "home", icon: "home", iconOff: "home-outline", labelKey: "navHome" },
  {
    key: "favorites",
    icon: "heart",
    iconOff: "heart-outline",
    labelKey: "navFavorites",
  },
  { key: "create", icon: "add", center: true },
  { key: "cart", icon: "cart", iconOff: "cart-outline", labelKey: "navCart" },
  {
    key: "profile",
    icon: "person",
    iconOff: "person-outline",
    labelKey: "navProfile",
  },
];

const maskPhone = (value) => {
  let v = value.replace(/\D/g, ""); // Remove tudo o que não é dígito

  if (v.length > 11) {
    v = v.slice(0, 11); // Limita a 11 dígitos
  }

  if (v.length <= 10) {
    
    v = v.replace(/(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    
    v = v.replace(/(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return v;
};

export default function ProfileScreen({ navigation }) {
  const { user, refreshUser, logout } = useAuth();
  const { isDarkMode, theme } = useTheme();
  const { showAlert, showConfirm } = useCustomAlert();
  const { t } = useLanguage();

  const [activeNav, setActiveNav] = useState("profile");
  const [savingField, setSavingField] = useState(false);
  const [editModal, setEditModal] = useState({
    visible: false,
    field: null,
    value: "",
  });

  // ─── Modal de edição ──────────────────────────────────────
  function openEditModal(field) {
    const value =
      field === "name"
        ? (user?.name ?? "")
        : field === "email"
          ? (user?.email ?? "")
          : (user?.phone ?? "");
    setEditModal({ visible: true, field, value });
  }

  function closeEditModal() {
    setEditModal({ visible: false, field: null, value: "" });
  }

  async function handleSaveField() {
    if (!editModal.value.trim()) return;
    if (editModal.field === "phone") {
      const rawPhone = editModal.value.replace(/\D/g, "");

      const ddd = rawPhone.substring(0, 2);

      if (rawPhone.length < 10 || ddd === "00" || Number(ddd) < 11) {
        showAlert({
          title: t("invalidPhoneTitle"),
          message: t("invalidPhoneMessage"),
          type: "danger",
        });
        return;
      }
    }
    try {
      if (editModal.field === "name") {
        await authService.updateProfileName(editModal.value);
        showAlert({
          title: t("successTitle"),
          message: t("updateNameSuccess"),
          type: "success",
        });
        return;
      } else if (editModal.field === "email") {
        if (editModal.field === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(editModal.value)) {
            showAlert({
              title: t("invalidEmailTitle"),
              message: t("invalidEmailMessage"),
              type: "danger",
            });
            return;
          }
        }
        await authService.updateProfileEmail(editModal.value);
        showAlert({
          title: t("successTitle"),
          message: t("updateEmailSuccess"),
          type: "success",
        });
      } else {
        await authService.updateProfilePhone(editModal.value);
        showAlert({
          title: t("successTitle"),
          message: t("updatePhoneSuccess"),
          type: "success",
        });
      }
      await refreshUser();
      closeEditModal();
    } catch (error) {
      showAlert({
        title: t("profileUpdateError"),
        message: error.message,
        type: "danger",
      });
    } finally {
      setSavingField(false);
    }
  }

  // ─── Logout ───────────────────────────────────────────────
  function handleLogout() {
    showConfirm({
      title: t("logoutAlertTitle"),
      message: t("logoutAlertMessage"),
      confirmText: t("logoutConfirm"),
      cancelText: t("cancel"),
      type: "danger",
      onConfirm: async () => {
        try {
          await logout();
        } catch (error) {
          showAlert({
            title: t("logoutErrorTitle"),
            message: error.message,
            type: "danger",
          });
        }
      },
    });
  }

  // ─── Alterar senha ────────────────────────────────────────
  async function handleChangePassword() {
    try {
      await authService.sendPasswordResetEmail(user.email);
      showAlert({
        title: t("successTitle"),
        message: t("passwordResetSent"),
        type: "success",
      });
    } catch (error) {
      showAlert({
        title: t("profileUpdateError"),
        message: error.message,
        type: "danger",
      });
    }
  }

  // Iniciais para o avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
          {t("myAccount")}
        </Text>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.titlePrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.titlePrimary }]}>
            {t("profileTitle")}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── CARD DE AVATAR ── */}
        <View
          style={[
            styles.avatarCard,
            {
              backgroundColor: theme.card,
              shadowColor: isDarkMode ? "#000" : "#a39f96",
            },
          ]}
        >
          <View
            style={[styles.avatarPlaceholder, { backgroundColor: NAVY_BLUE }]}
          >
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={[styles.avatarName, { color: theme.textPrimary }]}>
            {t("hello")}, {user?.name}!
          </Text>
          <Text style={[styles.avatarEmail, { color: theme.textMuted }]}>
            {user?.email}
          </Text>
        </View>

        {/* ── DADOS PESSOAIS ── */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          {t("personalData")}
        </Text>
        <View
          style={[
            styles.optionsBlock,
            {
              backgroundColor: theme.card,
              shadowColor: isDarkMode ? "#000" : "#a39f96",
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: theme.divider }]}
            activeOpacity={0.7}
            onPress={() => openEditModal("name")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
            >
              <MaterialIcons
                name="person"
                size={22}
                color={theme.textPrimary}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.textMuted }]}>
                {t("profileName")}
              </Text>
              <Text
                style={[styles.settingValue, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {user?.name}
              </Text>
            </View>
            <MaterialIcons name="edit" size={20} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: theme.divider }]}
            activeOpacity={0.7}
            onPress={() => openEditModal("email")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
            >
              <MaterialIcons name="email" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.textMuted }]}>
                {t("profileEmail")}
              </Text>
              <Text
                style={[styles.settingValue, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {user?.email}
              </Text>
            </View>
            <MaterialIcons name="edit" size={20} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowLast]}
            activeOpacity={0.7}
            onPress={() => openEditModal("phone")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
            >
              <MaterialIcons name="phone" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.textMuted }]}>
                {t("profilePhone")}
              </Text>
              <Text
                style={[styles.settingValue, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {user?.phone || "—"}
              </Text>
            </View>
            <MaterialIcons name="edit" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ── SEGURANÇA ── */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          {t("security")}
        </Text>
        <View
          style={[
            styles.optionsBlock,
            {
              backgroundColor: theme.card,
              shadowColor: isDarkMode ? "#000" : "#a39f96",
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowLast]}
            activeOpacity={0.7}
            onPress={handleChangePassword}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
            >
              <MaterialIcons name="lock" size={22} color={theme.textPrimary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>
                {t("changePassword")}
              </Text>
              <Text
                style={[styles.settingSubtitle, { color: theme.textMuted }]}
              >
                {t("changePasswordSub")}
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={theme.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* ── HISTÓRICO DE COMPRAS ── */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          {t("purchaseHistory")}
        </Text>
        <View
          style={[
            styles.optionsBlock,
            {
              backgroundColor: theme.card,
              shadowColor: isDarkMode ? "#000" : "#a39f96",
            },
          ]}
        >
          <View style={styles.emptyState}>
            <MaterialIcons
              name="receipt-long"
              size={36}
              color={theme.textMuted}
            />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              {t("noPurchases")}
            </Text>
          </View>
        </View>

        {/* ── LOGOUT ── */}
        <View
          style={[
            styles.optionsBlock,
            {
              backgroundColor: theme.card,
              shadowColor: isDarkMode ? "#000" : "#a39f96",
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowLast]}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#fff0ed" }]}
            >
              <MaterialIcons name="logout" size={22} color="#b42318" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: "#b42318" }]}>
                {t("logoutProfile")}
              </Text>
              <Text
                style={[styles.settingSubtitle, { color: theme.textMuted }]}
              >
                {t("logoutProfileSub")}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#b42318" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { backgroundColor: theme.card }]}>
        {NAV_ITEMS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, tab.center && styles.navItemCenter]}
            onPress={() => {
              setActiveNav(tab.key);
              if (tab.center) navigation.navigate("ProductCreate");
              if (tab.key === "home") navigation.navigate("Products");
              if (tab.key === "cart") navigation.navigate("Cart");
            }}
          >
            {tab.center ? (
              <View
                style={[
                  styles.navCreateBtn,
                  {
                    borderColor: theme.card,
                    backgroundColor: NAVY_BLUE,
                    shadowColor: NAVY_BLUE,
                  },
                ]}
              >
                <Ionicons name="add" size={28} color={WHITE} />
              </View>
            ) : (
              <>
                <Ionicons
                  name={activeNav === tab.key ? tab.icon : tab.iconOff}
                  size={22}
                  color={
                    activeNav === tab.key ? theme.navActive : theme.navInactive
                  }
                />
                <Text
                  style={[
                    styles.navLabel,
                    { color: theme.navInactive },
                    activeNav === tab.key && {
                      color: theme.navActive,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {t(tab.labelKey)}
                </Text>
                {activeNav === tab.key && (
                  <View
                    style={[
                      styles.navDot,
                      { backgroundColor: theme.navActive },
                    ]}
                  />
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── MODAL DE EDIÇÃO ── */}
      <Modal
        visible={editModal.visible}
        transparent
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeEditModal}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: theme.card }]}
            onPress={() => {}}
          >
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              {editModal.field === "name"
                ? t("editName")
                : editModal.field === "email"
                  ? t("editEmail")
                  : t("editPhone")}
            </Text>
            <AppInput
              label={
                editModal.field === "name"
                  ? t("newNameLabel")
                  : editModal.field === "email"
                    ? t("newEmailLabel")
                    : t("newPhoneLabel")
              }
              icon={
                editModal.field === "name"
                  ? "person"
                  : editModal.field === "email"
                    ? "email"
                    : "phone"
              }
              placeholder={
                editModal.field === "name"
                  ? t("namePlaceholder")
                  : editModal.field === "email"
                    ? t("emailPlaceholder")
                    : t("phonePlaceholder")
              }
              value={editModal.value}
              onChangeText={(v) => {
                let formattedValue = v;
                if (editModal.field === "phone") {
                  formattedValue = maskPhone(v);
                }
                setEditModal((prev) => ({ ...prev, value: formattedValue }));
              }}
              autoCapitalize={editModal.field === "name" ? "words" : "none"}
              keyboardType={
                editModal.field === "email"
                  ? "email-address"
                  : editModal.field === "phone"
                    ? "phone-pad"
                    : "default"
              }
              autoFocus
            />
            <AppButton
              title={savingField ? t("loading") : t("saveChanges")}
              onPress={handleSaveField}
              disabled={savingField || !editModal.value.trim()}
              style={{ marginBottom: 8 }}
            />
            <AppButton
              title={t("cancel")}
              variant="ghost"
              onPress={closeEditModal}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  headerTitle: { fontSize: 20, fontWeight: "900", letterSpacing: 3 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 130 },

  avatarCard: {
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitials: { color: WHITE, fontSize: 30, fontWeight: "800" },
  avatarName: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  avatarEmail: { fontSize: 13 },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 4,
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTextContainer: { flex: 1, marginLeft: 14, paddingRight: 8 },
  settingLabel: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  settingValue: { fontSize: 15, fontWeight: "700" },
  settingTitle: { fontSize: 14, fontWeight: "700" },
  settingSubtitle: { fontSize: 11, marginTop: 2, lineHeight: 14 },

  emptyState: { paddingVertical: 28, alignItems: "center", gap: 10 },
  emptyText: { fontSize: 13, fontWeight: "500", textAlign: "center" },

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
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  navItemCenter: { marginTop: -28 },
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
  navLabel: { fontSize: 10, fontWeight: "500" },
  navDot: { width: 4, height: 4, borderRadius: 2 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 20 },
});
