import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";

export default function VLTextInput({ passwordInput, ...rest }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        secureTextEntry={passwordInput && !showPassword}
        {...rest}
      />
      {passwordInput && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {!showPassword ? (
            <Feather name="eye" size={24} color="black" />
          ) : (
            <Feather name="eye-off" size={24} color="black" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    color: "red",
    width: 200,
  },
  inputContainer: {
    width: 300,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
