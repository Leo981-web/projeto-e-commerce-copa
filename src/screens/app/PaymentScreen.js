import React, { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCustomAlert } from "../../context/CustomAlertContext";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { useCart } from "../../context/CartContext";
import { checkoutCart } from "../../services/productService";

const NAVY = '#1A237E';
const GREEN = '#00A650';
const YELLOW = '#FFD600';
const CREAM = '#F5F1E8';

export default function PaymentScreen({ route, navigation }) {
  const { showAlert } = useCustomAlert();
  const { cart, clearCart } = useCart();
  
  const totalValue = route?.params?.total || 150.00; 

  const [paymentMethod, setPaymentMethod] = useState("pix"); 
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const handleCardNumberChange = (text) => {
    const cleanText = text.replace(/[^0-9]/g, "").slice(0, 16);
    setCardNumber(cleanText);
  };

  const handleExpiryChange = (text) => {
    const cleanText = text.replace(/[^0-9]/g, "").slice(0, 4);
    if (cleanText.length > 2) {
      setCardExpiry(`${cleanText.slice(0, 2)}/${cleanText.slice(2)}`);
    } else {
      setCardExpiry(cleanText);
    }
  };

  const handleCVVChange = (text) => {
    const cleanText = text.replace(/[^0-9]/g, "").slice(0, 3);
    setCardCVV(cleanText);
  };

  async function handleFinalizePayment() {
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
        showAlert({
          title: "Atenção",
          message: "Por favor, preencha todos os dados do cartão.",
          type: "warning",
        });
        return;
      }

      if (cardNumber.length < 16) {
        showAlert({
          title: "Cartão Inválido",
          message: "O número do cartão deve conter exatamente 16 dígitos numéricos.",
          type: "warning",
        });
        return;
      }

      const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
      if (!nameRegex.test(cardName)) {
        showAlert({
          title: "Nome Inválido",
          message: "O nome impresso no cartão deve conter apenas letras.",
          type: "warning",
        });
        return;
      }

      if (cardExpiry.length < 5) {
        showAlert({
          title: "Validade Inválida",
          message: "A data de vencimento deve estar no formato MM/AA.",
          type: "warning",
        });
        return;
      }

      if (cardCVV.length < 3) {
        showAlert({
          title: "CVV Inválido",
          message: "O código de segurança (CVV) deve conter 3 dígitos.",
          type: "warning",
        });
        return;
      }
    }

    setLoading(true);
    try {
      // Captura os itens ANTES de limpar o carrinho, senão a tela
      // de comprovante receberia uma lista vazia.
      const purchasedItems = cart;

      await checkoutCart(cart);
      clearCart();

      let note = "";
      if (paymentMethod === "pix") {
        note = "Seu código Pix foi gerado! Copie o código para pagar no seu banco.";
      } else if (paymentMethod === "boleto") {
        note = "Seu boleto foi gerado com sucesso! Enviamos o código de barras para o seu e-mail para a realização do pagamento.";
      } else {
        note = "Seu pagamento foi aprovado! Enviamos os detalhes para o seu e-mail.";
      }

      navigation.replace("Receipt", {
        items: purchasedItems,
        total: totalValue,
        paymentMethod,
        orderId: Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        note,
      });
    } catch (error) {
      showAlert({
        title: "Erro no Pagamento",
        message: error.message || "Não foi possível processar o seu pedido.",
        type: "warning",
      });
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
          
          <TouchableOpacity 
            style={[styles.methodButton, paymentMethod === "pix" && styles.methodButtonSelected]} 
            onPress={() => setPaymentMethod("pix")}
          >
            <Ionicons name="qr-code-outline" size={24} color={paymentMethod === "pix" ? '#FFFFFF' : NAVY} />
            <Text style={[styles.methodText, paymentMethod === "pix" && styles.methodTextSelected]}>Pix</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.methodButton, paymentMethod === "card" && styles.methodButtonSelected]} 
            onPress={() => setPaymentMethod("card")}
          >
            <Ionicons name="card-outline" size={24} color={paymentMethod === "card" ? '#FFFFFF' : NAVY} />
            <Text style={[styles.methodText, paymentMethod === "card" && styles.methodTextSelected]}>Cartão</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.methodButton, paymentMethod === "boleto" && styles.methodButtonSelected]} 
            onPress={() => setPaymentMethod("boleto")}
          >
            <Ionicons name="barcode-outline" size={24} color={paymentMethod === "boleto" ? '#FFFFFF' : NAVY} />
            <Text style={[styles.methodText, paymentMethod === "boleto" && styles.methodTextSelected]}>Boleto</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.detailsContainer}>
          {paymentMethod === "pix" && (
            <View style={styles.infoBox}>
              <Ionicons name="flash-outline" size={32} color={GREEN} />
              <Text style={styles.infoTitle}>Liberação imediata</Text>
              <Text style={styles.infoDescription}>
                O código Pix Copia e Cola será gerado assim que você finalizar o pedido.
              </Text>
            </View>
          )}

          {paymentMethod === "boleto" && (
            <View style={styles.infoBox}>
              <Ionicons name="document-text-outline" size={32} color={NAVY} />
              <Text style={styles.infoTitle}>Vencimento em 3 dias úteis</Text>
              <Text style={styles.infoDescription}>
                O boleto pode levar até 2 dias úteis após o pagamento para ser compensado pelo banco.
              </Text>
            </View>
          )}

          {paymentMethod === "card" && (
            <View style={styles.formCard}>
              <AppInput
                icon="card"
                placeholder="Número do Cartão"
                keyboardType="numeric"
                maxLength={16}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
              />
              <AppInput
                icon="person"
                placeholder="Nome impresso no cartão"
                autoCapitalize="characters"
                value={cardName}
                onChangeText={setCardName}
              />
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <AppInput
                    icon="calendar"
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    maxLength={5}
                    value={cardExpiry}
                    onChangeText={handleExpiryChange}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <AppInput
                    icon="lock-closed"
                    placeholder="CVV"
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    value={cardCVV}
                    onChangeText={handleCVVChange}
                  />
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
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NAVY,
    marginTop: 8,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
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