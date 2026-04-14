import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProductList() {
  return (
    <View style={styles.container}>
      <Text>Produtos...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
});
