import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import AppRoutes from "./AppRoutes";
import AuthRoutes from "./AuthRoutes";
import Loading from "../components/Loading";

export default function Routes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

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
