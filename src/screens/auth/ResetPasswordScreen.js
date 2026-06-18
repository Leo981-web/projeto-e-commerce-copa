import { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguage } from "../../context/LanguageContext";

import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { supabase } from '../../services/supabase';
import { useCustomAlert } from "../../context/CustomAlertContext";

const NAVY = '#1A237E';
const GREEN = '#00A650';
const YELLOW = '#FFD600';
const CREAM = '#F5F1E8';

export default function ResetPasswordScreen({ navigation }) {
  const { showAlert } = useCustomAlert();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!password || !confirmPassword) {
      showAlert({
        title: "Atenção",
        message: "Por favor, preencha todos os campos.",
        type: "warning",
      });
      return;
    }

    if (password !== confirmPassword) {
      showAlert({
        title: "Atenção",
        message: "As senhas informadas não coincidem.",
        type: "warning",
      });
      return;
    }

    if (password.length < 6) {
      showAlert({
        title: "Senha Fraca",
        message: "A nova senha deve conter pelo menos 6 caracteres.",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      showAlert({
        title: "Sucesso",
        message: "Sua nova senha foi salva! Volte ao jogo.",
        type: "success",
      });
      
      navigation.navigate("Login");
    } catch (error) {
      showAlert({
        title: "Erro ao Atualizar",
        message: error.message,
        type: "warning",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>

      
      <View style={styles.squareTopLeft} />
      <View style={styles.circleTopRight} />
      <View style={styles.diamondBottomRight} />
      <View style={styles.circleBottomLeft} />

      <View style={styles.container}>

        <View style={styles.mainCard}>

         
          <View style={styles.iconBadge}>
            <Ionicons name="lock-open-outline" size={44} color={NAVY} />
          </View>

          {/* Textos de Cabeçalho */}
          <View style={styles.textContainer}>
            <Text style={styles.headline}>Nova{"\n"}Senha</Text>
            <Text style={styles.subheadline}>Defina seus novos dados de acesso para garantir sua escalação.</Text>
          </View>

          
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <AppInput
                autoCapitalize="none"
                icon="lock-closed"
                secureTextEntry
                onChangeText={setPassword}
                placeholder="DIGITE SUA NOVA SENHA"
                value={password}
                style={styles.inputNavy}
              />
            </View>

            <View style={styles.inputWrapper}>
              <AppInput
                autoCapitalize="none"
                icon="lock-closed"
                secureTextEntry
                onChangeText={setConfirmPassword}
                placeholder="CONFIRME SUA NOVA SENHA"
                value={confirmPassword}
                style={styles.inputNavy}
              />
            </View>

            {/* Botões de Ação */}
            <AppButton
              disabled={loading}
              onPress={handleResetPassword}
              title={loading ? "SALVANDO..." : "ATUALIZAR SENHA"}
            />

            <AppButton
              icon="arrow-back"
              onPress={() => navigation.goBack()}
              style={styles.linkButton}
              title="CANCELAR"
              variant="ghost"
            />
          </View>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CREAM,
  },
  squareTopLeft: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 32,
    backgroundColor: NAVY,
    opacity: 0.85,
  },
  circleTopRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: YELLOW,
    opacity: 0.25,
  },
  diamondBottomRight: {
    position: 'absolute',
    bottom: 40,
    right: -40,
    width: 130,
    height: 130,
    borderRadius: 24,
    borderWidth: 14,
    borderColor: GREEN,
    backgroundColor: 'transparent',
    transform: [{ rotate: '45deg' }],
    opacity: 0.35,
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: YELLOW,
    opacity: 0.55,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    color: NAVY,
    lineHeight: 34,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subheadline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00A650',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 12,
  },
  inputNavy: {
    borderLeftWidth: 4,
    borderLeftColor: NAVY,
    borderRadius: 14,
    overflow: 'hidden',
  },
  linkButton: {
    marginTop: 12,
  },
});