import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { useCustomAlert } from "../../context/CustomAlertContext";

export default function RegisterScreen({ navigation }) {
  const { loading, register } = useAuth();
  const { showAlert } = useCustomAlert();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      await register(name, email, password);
    } catch (error) {
      showAlert({
        title: "Não foi possível registrar",
        message: error.message,
        type: "warning",
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>
        Cadastre-se para gerenciar seus produtos.
      </Text>

      <TextInput
        onChangeText={setName}
        placeholder="Nome"
        style={styles.input}
        value={name}
      />
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
        onPress={handleRegister}
        style={styles.primaryButton}
      >
        <MaterialIcons name="person-add-alt" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>
          {loading ? "Criando..." : "Registrar"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.replace("Login")}
        style={styles.secondaryButton}
      >
        <MaterialIcons name="arrow-back" size={18} color="#2d7d59" />
        <Text style={styles.secondaryButtonText}>Voltar ao login</Text>
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
    fontSize: 30,
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
  secondaryButton: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  secondaryButtonText: {
    color: "#2d7d59",
    fontSize: 16,
    fontWeight: "700",
  },
});
