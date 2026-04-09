import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import VLTextInput from "../components/VLTextInput";
import VLButton from "../components/VLButton";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <VLTextInput
        value={email}
        onChangeText={setEmail}
        placeholder={"Digite o seu email"}
      />
      <VLTextInput
        passwordInput={true}
        value={password}
        onChangeText={setPassword}
        placeholder={"Digite a sua senha"}
      />
      <VLButton
        title="Entrar"
        action={() =>
          navigation.navigate("Home", {
            email,
          })
        }
      />
      <VLButton
        title="Ir para o cadastro"
        action={() => navigation.navigate("Cadastro")}
        secondary={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
