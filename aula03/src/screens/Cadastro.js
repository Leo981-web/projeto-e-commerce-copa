import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import VLTextInput from "../components/VLTextInput";
import VLButton from "../components/VLButton";

export default function Cadastro({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <VLTextInput
        value={name}
        onChangeText={setName}
        placeholder={"Digite o seu nome"}
      />
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
      <VLButton title="Cadastrar" action={() => navigation.navigate("Home")} />
      <VLButton
        title="Ir para o login"
        action={() => navigation.goBack()}
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
