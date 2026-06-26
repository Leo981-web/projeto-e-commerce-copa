import React, { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCustomAlert } from "../../context/CustomAlertContext";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { useCart } from "../../context/CartContext";
import { useHistory } from "../../context/HistoryContext";
import { createOrder } from "../../services/orderService";

const NAVY = '#1A237E';
const GREEN = '#00A650';
const CREAM = '#F5F1E8';

export default function PaymentScreen({ route, navigation }) {
  const { showAlert } = useCustomAlert();
  const { cart, clearCart } = useCart();
  const { addOrder } = useHistory();

  const totalValue = route?.params?.total || 150.00;
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const handleCardNumberChange = (text) => { const clean = text.replace(/[^0-9]/g, "").slice(0, 16); setCardNumber(clean); };
  const handleExpiryChange = (text) => {
    const clean = text.replace(/[^0-9]/g, "").slice(0, 4);
    setCardExpiry(clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean);
  };
  const handleCVVChange = (text) => { setCardCVV(text.replace(/[^0-9]/g, "").slice(0, 3)); };

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

        <Text style={styles.sectionTitle}>Selecione a forma de pagamento</Text>

        <View style={styles.methodsContainer}>
          <TouchableOpacity style={[styles.methodButton, paymentMethod === "pix" && styles.methodButtonSelected]} onPress={() => setPaymentMethod("pix")}>
            <Ionicons name="qr-code-outline" size={24} color={paymentMethod === "pix" ? '#FFFFFF' : NAVY} />
            <Text style={[styles.methodText, paymentMethod === "pix" && styles.methodTextSelected]}>Pix</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.methodButton, paymentMethod === "card" && styles.methodButtonSelected]} onPress={() => setPaymentMethod("card")}>
            <Ionicons name="card-outline" size={24} color={paymentMethod === "card" ? '#FFFFFF' : NAVY} />
            <Text style={[styles.methodText, paymentMethod === "card" && styles.methodTextSelected]}>Cartão</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.methodButton, paymentMethod === "boleto" && styles.methodButtonSelected]} onPress={() => setPaymentMethod("boleto")}>
            <Ionicons name="barcode-outline" size={24} color={paymentMethod === "boleto" ? '#FFFFFF' : NAVY} />
            <Text style={[styles.methodText, paymentMethod === "boleto" && styles.methodTextSelected]}>Boleto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          {paymentMethod === "card" && (
            <View style={styles.formCard}>
              <AppInput icon="card" placeholder="Número do Cartão" keyboardType="numeric" maxLength={16} value={cardNumber} onChangeText={handleCardNumberChange} />
              <AppInput icon="person" placeholder="Nome impresso no cartão" autoCapitalize="characters" value={cardName} onChangeText={setCardName} />
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <AppInput icon="calendar" placeholder="MM/AA" keyboardType="numeric" maxLength={5} value={cardExpiry} onChangeText={handleExpiryChange} />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <AppInput icon="lock-closed" placeholder="CVV" keyboardType="numeric" maxLength={3} secureTextEntry value={cardCVV} onChangeText={handleCVVChange} />
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonWrapper}>
          <AppButton
            disabled={loading}
            icon="checkmark-circle"
            title={loading ? "PROCESSANDO..." : "FINALIZAR COMPRA"}
            onPress={handleFinalizePayment}
          />
          <AppButton
            icon="arrow-back"
            title="VOLTAR AO CARRINHO"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 8 }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContainer: {
    padding: 16,
    justifyContent: 'center',
  },
  totalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderLeftWidth: 5,
    borderLeftColor: GREEN,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '900',
    color: NAVY,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 12,
  },
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
  },
  methodButtonSelected: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    width: '100%',
  }
});