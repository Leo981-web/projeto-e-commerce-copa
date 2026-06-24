import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

/**
 * Tela exibida quando um usuário Common tenta acessar uma funcionalidade
 * exclusiva de Admin. Na prática raramente aparece porque as rotas Admin
 * já são removidas do Stack em AppRoutes.js — serve como fallback de segurança.
 */
export default function UnauthorizedScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <MaterialIcons name="lock" size={64} color="#EF4444" />
      <Text style={styles.title}>Acesso Restrito</Text>
      <Text style={styles.subtitle}>
        Você não tem permissão para acessar esta área.
        Esta funcionalidade é exclusiva de administradores.
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Products")}
      >
        <Text style={styles.buttonText}>Voltar para a loja</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      gap: 16,
      backgroundColor: theme.bg,
    },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.titlePrimary,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textMuted,
      textAlign: "center",
      lineHeight: 22,
    },
    button: {
      marginTop: 8,
      backgroundColor: "#15622A",
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 12,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 15,
    },
  });