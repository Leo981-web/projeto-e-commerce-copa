import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import VLButton from "../components/VLButton";

export default function Home({ navigation, route }) {
  const { email, name } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>{name}</Text>
      <Text>{email}</Text>
      <VLButton title={"Sair"} action={() => navigation.navigate("Login")} />
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
