import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Home({ navigation }) {
  function handleLogout() {
    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Home</Text>

      <Text style={styles.text}>Você está logado.</Text>

      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
});
