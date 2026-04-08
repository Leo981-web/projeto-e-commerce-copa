import { useState, useEffect, useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import VLButton from "./src/components/VLButton";

export default function App() {
  const [showText, setShowText] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function showAlert() {
    return Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        onPress: () => Alert.alert("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => Alert.alert("Ok Pressed"),
        style: "ok",
      },
    ]);
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <>
          <Text>Olá mundo</Text>
          <StatusBar style="auto" />
          <Button title="Clique aqui" onPress={() => setShowText(!showText)} />
          <VLButton
            title={"Clique aqui"}
            action={showAlert}
            customStyle={{ backgroundColor: "#8f1eb8ff" }}
          />
          {showText ? <Text>CLICOU NO BOTAO</Text> : <></>}
          <VLButton title={"Entrar"} action={showAlert} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});

//felipe molz
