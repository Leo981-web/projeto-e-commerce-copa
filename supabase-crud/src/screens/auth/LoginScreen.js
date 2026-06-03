import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { useCustomAlert } from "../../context/CustomAlertContext";

export default function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const { showAlert } = useCustomAlert();
  const [email, setEmail] = useState("professor@email.com");
  const [password, setPassword] = useState("123456");

  async function handleLogin() {
    try {
      await login(email, password);
    } catch (error) {
      showAlert({
        title: "Não foi possível entrar",
        message: error.message,
        type: "warning",
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      <Text style={styles.subtitle}>Entre para gerenciar produtos.</Text>

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="E-mail"
        style={styles.input}
        value={email}
      />
      <TextInput
        onChangeText={setPassword}
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        value={password}
      />

      <Pressable
        disabled={loading}
        onPress={handleLogin}
        style={styles.primaryButton}
      >
        <MaterialIcons name="login" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.replace("Register")}
        style={styles.linkButton}
      >
        <MaterialIcons name="person-add-alt" size={18} color="#2d7d59" />
        <Text style={styles.linkText}>Criar uma conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f1ea",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#20242c",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    color: "#4b5563",
  },
  input: {
    height: 48,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee4d8",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  primaryButton: {
    flexDirection: "row",
    gap: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#2d7d59",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  linkButton: {
    flexDirection: "row",
    gap: 6,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: "#2d7d59",
    fontSize: 16,
    fontWeight: "600",
  },
});
