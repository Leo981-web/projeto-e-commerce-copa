import { createContext, useContext, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import AppText from "../components/AppText";

const CustomAlertContext = createContext(null);

const GREEN      = "#15622A";
const GREEN_MID  = "#22C55E";
const GREEN_DARK = "#0D4A1A";
const GOLD       = "#F5C518";
const RED        = "#EF4444";
const RED_DARK   = "#991B1B";

// ── Config por tipo ────────────────────────────────────────────────────────
const ALERT_CONFIG = {
  success: {
    icon:        "check-circle",
    iconColor:   GREEN_MID,
    iconBg:      "rgba(34,197,94,0.13)",
    stripe1:     GREEN,
    stripe2:     GOLD,
    stripe3:     GREEN_MID,
    btnBg:       GREEN_DARK,
    glowColor:   "rgba(34,197,94,0.18)",
  },
  warning: {
    icon:        "warning",
    iconColor:   GOLD,
    iconBg:      "rgba(245,197,24,0.14)",
    stripe1:     GOLD,
    stripe2:     GREEN,
    stripe3:     "#F97316",
    btnBg:       "#92400E",
    glowColor:   "rgba(245,197,24,0.18)",
  },
  danger: {
    icon:        "delete-forever",
    iconColor:   RED,
    iconBg:      "rgba(239,68,68,0.12)",
    stripe1:     RED,
    stripe2:     RED_DARK,
    stripe3:     "#FCA5A5",
    btnBg:       RED,
    glowColor:   "rgba(239,68,68,0.15)",
  },
};

export function CustomAlertProvider({ children }) {
  const [alertConfig, setAlertConfig] = useState(null);

  function closeAlert() {
    const cb = alertConfig?.onClose;
    setAlertConfig(null);
    if (cb) cb();
  }

  function showAlert({ title, message, type = "warning", buttonText = "Entendi", onClose }) {
    setAlertConfig({ title, message, type, buttonText, onClose, isConfirm: false });
  }

  function dismissConfirm() { setAlertConfig(null); }

  function showConfirm({ title, message, type = "danger", confirmText = "Confirmar", cancelText = "Cancelar", onConfirm }) {
    setAlertConfig({ title, message, type, confirmText, cancelText, onConfirm, isConfirm: true });
  }

  async function handleConfirm() {
    const cb = alertConfig?.onConfirm;
    setAlertConfig(null);
    if (cb) await cb();
  }

  const value = useMemo(() => ({ showAlert, showConfirm }), []);
  const cfg = ALERT_CONFIG[alertConfig?.type] ?? ALERT_CONFIG.warning;

  return (
    <CustomAlertContext.Provider value={value}>
      {children}

      <Modal animationType="fade" onRequestClose={closeAlert} transparent visible={Boolean(alertConfig)}>
        <View style={styles.overlay}>

          {/* Glow difuso colorido atrás do card */}
          <View style={[styles.glow, { backgroundColor: cfg.glowColor, shadowColor: cfg.iconColor }]} />

          <View style={styles.card}>

            {/* Faixa 3 cores no topo */}
            <View style={styles.stripeRow}>
              <View style={[styles.stripe, { backgroundColor: cfg.stripe1 }]} />
              <View style={[styles.stripe, { backgroundColor: cfg.stripe2 }]} />
              <View style={[styles.stripe, { backgroundColor: cfg.stripe3 }]} />
            </View>

            {/* Botão fechar */}
            <Pressable
              hitSlop={10}
              onPress={alertConfig?.isConfirm ? dismissConfirm : closeAlert}
              style={styles.closeBtn}
            >
              <MaterialIcons name="close" size={16} color="#6B7280" />
            </Pressable>

            {/* Ícone grande centralizado */}
            <View style={styles.iconWrap}>
              <View style={[styles.iconBg, { backgroundColor: cfg.iconBg }]}>
                <MaterialIcons name={cfg.icon} size={44} color={cfg.iconColor} />
              </View>
            </View>

            {/* Título */}
            <Text style={styles.title}>{alertConfig?.title}</Text>

            {/* Mensagem */}
            <Text style={styles.message}>{alertConfig?.message}</Text>

            {/* Divisor */}
            <View style={styles.divider} />

            {/* Botões */}
            {alertConfig?.isConfirm ? (
              <View style={styles.actions}>
                {/* Cancelar — neutro escuro igual à ref */}
                <Pressable style={styles.cancelBtn} onPress={dismissConfirm}>
                  <Text style={styles.cancelText}>{alertConfig.cancelText}</Text>
                </Pressable>
                {/* Confirmar — cor do tipo */}
                <Pressable style={[styles.actionBtn, { backgroundColor: cfg.btnBg }]} onPress={handleConfirm}>
                  <MaterialIcons
                    name={alertConfig.type === "danger" ? "delete-outline" : "check"}
                    size={16}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.actionText}>{alertConfig.confirmText}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={[styles.singleBtn, { backgroundColor: cfg.btnBg }]} onPress={closeAlert}>
                <Text style={styles.singleBtnText}>{alertConfig?.buttonText}</Text>
              </Pressable>
            )}

          </View>
        </View>
      </Modal>
    </CustomAlertContext.Provider>
  );
}

export function useCustomAlert() {
  const ctx = useContext(CustomAlertContext);
  if (!ctx) throw new Error("useCustomAlert deve ser usado dentro de CustomAlertProvider.");
  return ctx;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: "rgba(3,10,5,0.72)",
  },

  // Glow difuso atrás do card
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 60,
  },

  card: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 14,
  },

  // Faixa 3 cores no topo
  stripeRow: { flexDirection: "row", height: 5 },
  stripe: { flex: 1 },

  // Fechar
  closeBtn: {
    position: "absolute", top: 14, right: 14, zIndex: 2,
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center", justifyContent: "center",
  },

  // Ícone centralizado
  iconWrap: { alignItems: "center", marginTop: 28, marginBottom: 16 },
  iconBg: {
    width: 88, height: 88,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
    paddingHorizontal: 24,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  message: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 28,
    lineHeight: 19,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
  },

  // Botão único
  singleBtn: {
    marginHorizontal: 22,
    marginBottom: 22,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  singleBtnText: {
    color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 0.2,
  },

  // 2 botões
  actions: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 22,
    marginBottom: 22,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F2937",
  },
  cancelText: {
    color: "#fff", fontSize: 14, fontWeight: "700",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "#fff", fontSize: 14, fontWeight: "800",
  },
});