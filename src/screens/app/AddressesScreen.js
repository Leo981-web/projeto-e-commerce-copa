import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import Loading from "../../components/Loading";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useCustomAlert } from "../../context/CustomAlertContext";

const ADDRESSES_STORAGE_KEY = "@user_addresses";

function emptyForm() {
  return {
    id: null,
    label: "",
    street: "",
    cityState: "",
    zip: "",
    complement: "",
  };
}

export default function AddressesScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { showAlert, showConfirm } = useCustomAlert();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(emptyForm());

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const stored = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
          setAddresses(stored ? JSON.parse(stored) : []);
        } finally {
          setLoading(false);
        }
      })();
    }, []),
  );

  async function persist(list) {
    setAddresses(list);
    await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(list));
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openAddModal() {
    setForm(emptyForm());
    setModalVisible(true);
  }

  function openEditModal(address) {
    setForm(address);
    setModalVisible(true);
  }

  async function handleSave() {
    if (
      !form.label.trim() ||
      !form.street.trim() ||
      !form.cityState.trim() ||
      !form.zip.trim()
    ) {
      showAlert({
        title: t("requiredFieldsTitle"),
        message: t("addressesRequiredFieldsMessage"),
        type: "warning",
      });
      return;
    }

    let updated;
    if (form.id) {
      updated = addresses.map((a) => (a.id === form.id ? { ...form } : a));
    } else {
      const newAddress = {
        ...form,
        id: Date.now().toString(),
        isDefault: addresses.length === 0,
      };
      updated = [...addresses, newAddress];
    }

    await persist(updated);
    setModalVisible(false);
    showAlert({
      title: t("addressesSavedTitle"),
      message: t("addressesSavedMessage"),
      type: "success",
    });
  }

  function handleDelete(address) {
    showConfirm({
      title: t("addressesDeleteConfirmTitle"),
      message: t("addressesDeleteConfirmMessage"),
      type: "danger",
      confirmText: t("addressesDeleteButton"),
      cancelText: t("addressesCancelButton"),
      onConfirm: async () => {
        const updated = addresses.filter((a) => a.id !== address.id);
        await persist(updated);
      },
    });
  }

  async function handleSetDefault(address) {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === address.id,
    }));
    await persist(updated);
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.bg}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.iconBg }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTexts}>
          <Text style={[styles.headerTitle, { color: theme.titlePrimary }]}>
            {t("addressesScreenTitle")}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
            {t("addressesScreenSubtitle")}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.navActive }]}
          onPress={openAddModal}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="location-off" size={64} color={theme.divider} />
          <Text style={[styles.emptyTitle, { color: theme.titlePrimary }]}>
            {t("addressesEmptyTitle")}
          </Text>
          <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
            {t("addressesEmptyDesc")}
          </Text>
          <AppButton
            title={t("addressesAddButton")}
            icon="add"
            onPress={openAddModal}
            style={{
              marginTop: 8,
              paddingHorizontal: 24,
              backgroundColor: theme.navActive,
            }}
          />
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.divider },
              ]}
            >
              <View style={styles.cardTop}>
                <View
                  style={[styles.iconWrap, { backgroundColor: theme.iconBg }]}
                >
                  <MaterialIcons
                    name="place"
                    size={18}
                    color={theme.navActive}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.labelRow}>
                    <Text
                      style={[styles.cardLabel, { color: theme.textPrimary }]}
                    >
                      {item.label}
                    </Text>
                    {item.isDefault ? (
                      <View
                        style={[
                          styles.defaultBadge,
                          { backgroundColor: theme.iconBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.defaultBadgeText,
                            { color: theme.navActive },
                          ]}
                        >
                          {t("addressesDefaultBadge")}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.cardLine, { color: theme.textMuted }]}>
                    {item.street}
                  </Text>
                  <Text style={[styles.cardLine, { color: theme.textMuted }]}>
                    {item.cityState} · {item.zip}
                  </Text>
                  {item.complement ? (
                    <Text style={[styles.cardLine, { color: theme.textMuted }]}>
                      {item.complement}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.cardActions}>
                {!item.isDefault ? (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(item)}
                    style={styles.actionBtn}
                  >
                    <MaterialIcons
                      name="star-outline"
                      size={15}
                      color={theme.navActive}
                    />
                    <Text
                      style={[styles.actionBtnText, { color: theme.navActive }]}
                    >
                      {t("addressesSetDefault")}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  style={styles.actionBtn}
                >
                  <MaterialIcons
                    name="edit"
                    size={15}
                    color={theme.textMuted}
                  />
                  <Text
                    style={[styles.actionBtnText, { color: theme.textMuted }]}
                  >
                    {t("addressesEditButton")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  style={styles.actionBtn}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={15}
                    color={theme.textDestructive}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      { color: theme.textDestructive },
                    ]}
                  >
                    {t("addressesDeleteButton")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.titlePrimary }]}>
              {form.id
                ? t("addressesFormTitleEdit")
                : t("addressesFormTitleAdd")}
            </Text>

            <AppInput
              icon="label"
              placeholder={t("addressesLabelPlaceholder")}
              value={form.label}
              onChangeText={(v) => updateField("label", v)}
            />
            <AppInput
              icon="place"
              placeholder={t("addressesStreetPlaceholder")}
              value={form.street}
              onChangeText={(v) => updateField("street", v)}
            />
            <AppInput
              icon="location-city"
              placeholder={t("addressesCityStatePlaceholder")}
              value={form.cityState}
              onChangeText={(v) => updateField("cityState", v)}
            />
            <AppInput
              icon="markunread-mailbox"
              placeholder={t("addressesZipPlaceholder")}
              keyboardType="numeric"
              maxLength={9}
              value={form.zip}
              onChangeText={(v) => updateField("zip", v)}
            />
            <AppInput
              icon="home"
              placeholder={t("addressesComplementPlaceholder")}
              value={form.complement}
              onChangeText={(v) => updateField("complement", v)}
              style={{ marginBottom: 0 }}
            />

            <View style={styles.modalActions}>
              <AppButton
                title={t("addressesCancelButton")}
                variant="ghost"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1 }}
                textStyle={{ color: theme.textMuted }}
              />
              <AppButton
                title={t("addressesSaveButton")}
                onPress={handleSave}
                style={{ flex: 1, backgroundColor: theme.navActive }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 10,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTexts: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  emptyDesc: { fontSize: 13, textAlign: "center", maxWidth: 280 },
  list: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 40 },
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 14,
  },
  cardTop: { flexDirection: "row", gap: 12 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardLabel: { fontSize: 15, fontWeight: "800" },
  defaultBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  defaultBadgeText: { fontSize: 10, fontWeight: "800" },
  cardLine: { fontSize: 12.5, marginTop: 3, lineHeight: 18 },
  cardActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionBtnText: { fontSize: 12, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 16 },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
});
