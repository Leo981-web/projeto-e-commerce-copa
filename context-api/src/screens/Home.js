import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthProvider";

export default function Home({ navigation }) {
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Home</Text>

      <Text style={styles.text}>Você está logado {user.email}.</Text>

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
