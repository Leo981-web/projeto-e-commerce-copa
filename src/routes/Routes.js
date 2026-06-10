import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import AppRoutes from "./AppRoutes";
import AuthRoutes from "./AuthRoutes";

export default function Routes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#2d7d59" size="large" />
      </View>
    );
  }

  // 2. Envolva o retorno das rotas com o ThemeProvider
  return (
    <ThemeProvider>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});