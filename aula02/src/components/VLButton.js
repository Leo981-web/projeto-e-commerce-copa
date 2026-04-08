import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function VLButton({ title, action, customStyle }) {
  return (
    <TouchableOpacity
      style={[styles.button, customStyle]}
      onPress={() => action()}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    height: 50,
    backgroundColor: "#6fddf1ff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
