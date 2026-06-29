import React, { useMemo, useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useTheme } from "../../context/ThemeContext";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppText from "../../components/AppText";
import { useCart } from "../../context/CartContext";
import { useHistory } from "../../context/HistoryContext";
import { createOrder } from "../../services/orderService";

const GREEN = "#15622A";
const GOLD = "#F5C518";

// Padrão fixo (não aleatório) só para simular visualmente um QR Code de Pix.
const QR_PATTERN = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1],
];

const PIX_CODE_PREVIEW =
  "00020126580014BR.GOV.BCB.PIX0136golup-pagamento-simulado520400005303986540";

function buildBoletoNumber(total) {
  const totalDigits = Math.round(total * 100).toString().padStart(10, "0").slice(-10);
  return `23793.${totalDigits.slice(0, 5)} 60082.${totalDigits.slice(5)}40 00012.500000 1 87370000${totalDigits}`;
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("pt-BR");
}

export default function PaymentScreen({ route, navigation }) {
  const { showAlert } = useCustomAlert();
  const { theme, isDarkMode } = useTheme();
  const { cart, clearCart } = useCart();
  const { addOrder } = useHistory();

  const styles = makeStyles(theme, isDarkMode);

  const totalValue = route?.params?.total || 150.00;
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [boletoGenerated, setBoletoGenerated] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressComplement, setAddressComplement] = useState("");

  const boletoNumber = useMemo(() => buildBoletoNumber(totalValue), [totalValue]);
  const boletoDueDate = useMemo(() => addDays(3), []);

  const handleCardNumberChange = (text) => { const clean = text.replace(/[^0-9]/g, "").slice(0, 16); setCardNumber(clean); };
  const handleExpiryChange = (text) => {
    const clean = text.replace(/[^0-9]/g, "").slice(0, 4);
    setCardExpiry(clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean);
  };
  const handleCVVChange = (text) => { setCardCVV(text.replace(/[^0-9]/g, "").slice(0, 3)); };

  function handleSelectMethod(method) {
    setPaymentMethod(method);
    setBoletoGenerated(false);
  }

  async function handleFinalizePayment() {
    setLoading(true);
    try {
      const orderFromApi = await createOrder(cart);

      const orderData = {
        id: orderFromApi.id,
        total: orderFromApi.total || totalValue,
        items: orderFromApi.items || cart,
        date: orderFromApi.date || new Date().toISOString(),
        paymentMethod,
        orderId: orderFromApi.orderId,
      };

      await addOrder(orderData);
      clearCart();

      navigation.replace("Receipt", orderData);
    } catch (error) {
      showAlert({ title: "Erro", message: "Não foi possível processar o pedido: " + error.message, type: "warning" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalValue}>R$ {totalValue.toFixed(2).replace('.', ',')}</Text>
        </View>

        <Text style={styles.sectionTitle}>Endereço de entrega</Text>
        <View style={styles.formCard}>
          <AppInput
            icon="place"
            placeholder="Endereço completo (rua, número, bairro)"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
          />
          <AppInput
            icon="markunread-mailbox"
            placeholder="CEP"
            keyboardType="numeric"
            maxLength={9}
            value={addressZip}
            onChangeText={setAddressZip}
          />
          <AppInput
            icon="home"
            placeholder="Complemento (opcional)"
            value={addressComplement}
            onChangeText={setAddressComplement}
            style={{ marginBottom: 0 }}
          />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Selecione a forma de pagamento</Text>

        <View style={styles.methodsContainer}>
          <TouchableOpacity style={[styles.methodButton, paymentMethod === "pix" && styles.methodButtonSelected]} onPress={() => handleSelectMethod("pix")}>
            <Ionicons name="qr-code-outline" size={24} color={paymentMethod === "pix" ? '#FFFFFF' : theme.titlePrimary} />
            <Text style={[styles.methodText, paymentMethod === "pix" && styles.methodTextSelected]}>Pix</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.methodButton, paymentMethod === "card" && styles.methodButtonSelected]} onPress={() => handleSelectMethod("card")}>
            <Ionicons name="card-outline" size={24} color={paymentMethod === "card" ? '#FFFFFF' : theme.titlePrimary} />
            <Text style={[styles.methodText, paymentMethod === "card" && styles.methodTextSelected]}>Cartão</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.methodButton, paymentMethod === "boleto" && styles.methodButtonSelected]} onPress={() => handleSelectMethod("boleto")}>
            <Ionicons name="barcode-outline" size={24} color={paymentMethod === "boleto" ? '#FFFFFF' : theme.titlePrimary} />
            <Text style={[styles.methodText, paymentMethod === "boleto" && styles.methodTextSelected]}>Boleto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          {paymentMethod === "card" && (
            <View style={styles.formCard}>
              <AppInput icon="credit-card" placeholder="Número do Cartão" keyboardType="numeric" maxLength={16} value={cardNumber} onChangeText={handleCardNumberChange} />
              <AppInput icon="person" placeholder="Nome impresso no cartão" autoCapitalize="characters" value={cardName} onChangeText={setCardName} />
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <AppInput icon="event" placeholder="MM/AA" keyboardType="numeric" maxLength={5} value={cardExpiry} onChangeText={handleExpiryChange} />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <AppInput icon="lock" placeholder="CVV" keyboardType="numeric" maxLength={3} secureTextEntry value={cardCVV} onChangeText={handleCVVChange} />
                </View>
              </View>
            </View>
          )}

          {paymentMethod === "pix" && (
            <View style={styles.formCard}>
              <AppText style={styles.pixInstructions}>
                Abra o app do seu banco e escaneie o código abaixo para pagar via Pix.
              </AppText>

              <View style={styles.qrWrap}>
                <View style={styles.qrCard}>
                  {QR_PATTERN.map((row, ri) => (
                    <View key={ri} style={styles.qrRow}>
                      {row.map((cell, ci) => (
                        <View
                          key={ci}
                          style={[styles.qrCell, { backgroundColor: cell ? "#0F172A" : "#FFFFFF" }]}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.pixCodeBox}>
                <Ionicons name="link-outline" size={16} color={theme.navActive} />
                <Text numberOfLines={1} style={styles.pixCodeText}>
                  {PIX_CODE_PREVIEW}
                </Text>
              </View>
              <Text style={styles.pixHint}>Código Pix simulado para fins de demonstração.</Text>
            </View>
          )}

          {paymentMethod === "boleto" && (
            <View style={styles.formCard}>
              <AppText style={styles.pixInstructions}>
                Gere o boleto e pague em qualquer banco, lotérica ou app bancário até o vencimento.
              </AppText>

              {!boletoGenerated ? (
                <Pressable style={styles.generateBoletoBtn} onPress={() => setBoletoGenerated(true)}>
                  <Ionicons name="barcode-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.generateBoletoBtnText}>Gerar boleto</Text>
                </Pressable>
              ) : (
                <View>
                  <View style={styles.barcodeWrap}>
                    {Array.from({ length: 42 }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.barcodeBar,
                          { width: i % 5 === 0 ? 3 : i % 3 === 0 ? 1.5 : 2.5 },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.boletoNumber}>{boletoNumber}</Text>
                  <View style={styles.boletoDueRow}>
                    <Ionicons name="calendar-outline" size={14} color={theme.textMuted} />
                    <Text style={styles.boletoDueText}>Vencimento: {boletoDueDate}</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.buttonWrapper}>
          <AppButton
            disabled={loading}
            icon="check-circle"
            title={loading ? "PROCESSANDO..." : "FINALIZAR COMPRA"}
            onPress={handleFinalizePayment}
            style={{ backgroundColor: GREEN }}
          />
          <AppButton
            icon="arrow-back"
            title="VOLTAR AO CARRINHO"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 8 }}
            textStyle={{ color: theme.navActive }}
            iconColor={theme.navActive}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (theme, isDarkMode) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  scrollContainer: {
    padding: 16,
    justifyContent: 'center',
  },
  totalCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderLeftWidth: 5,
    borderLeftColor: theme.navActive,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textMuted,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.titlePrimary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.titlePrimary,
    marginBottom: 12,
  },
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: theme.divider,
  },
  methodButtonSelected: {
    backgroundColor: theme.navActive,
    borderColor: theme.navActive,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.titlePrimary,
    marginTop: 6,
  },
  methodTextSelected: {
    color: '#FFFFFF',
  },
  detailsContainer: {
    minHeight: 180,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.25 : 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    width: '100%',
  },
  pixInstructions: {
    fontSize: 13,
    color: theme.textMuted,
    marginBottom: 16,
    lineHeight: 18,
  },
  qrWrap: { alignItems: "center", marginBottom: 16 },
  qrCard: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.divider,
  },
  qrRow: { flexDirection: "row" },
  qrCell: { width: 12, height: 12 },
  pixCodeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.iconBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pixCodeText: {
    flex: 1,
    fontSize: 11,
    color: theme.textMuted,
    fontFamily: "monospace",
  },
  pixHint: {
    fontSize: 11,
    color: theme.textMuted,
    marginTop: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
  generateBoletoBtn: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  generateBoletoBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  barcodeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  barcodeBar: {
    height: 46,
    backgroundColor: "#0F172A",
  },
  boletoNumber: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
    color: theme.titlePrimary,
    textAlign: "center",
    fontFamily: "monospace",
  },
  boletoDueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  boletoDueText: {
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: "600",
  },
});
