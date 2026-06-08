import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { updatePassword } from '../../services/authService';

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  async function handleUpdatePassword() {
    setErrorMessage(''); 

    
    if (password.length < 6) {
      setErrorMessage("A senha precisa ter pelo menos 6 dígitos.");
      return; 
    }

    setLoading(true);
    try {
      await updatePassword(password);
      Alert.alert("Sucesso", "Senha atualizada com sucesso (Simulado)!");
      
      navigation.navigate("Login");
    } catch (error) {
      setErrorMessage(error.message); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Senha</Text>
      
      <TextInput
        style={[styles.input, errorMessage ? styles.inputError : null]}
        placeholder="Digite a nova senha (mínimo 6 caracteres)"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMessage(''); 
        }}
        secureTextEntry
      />

     
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Button 
        title={loading ? "A atualizar..." : "Atualizar Senha"} 
        onPress={handleUpdatePassword} 
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: "#f5f1ea" },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1A237E' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 8, backgroundColor: '#fff' },
  inputError: { borderColor: '#d32f2f', borderWidth: 2 }, // Borda vermelha se der erro
  errorText: { color: '#d32f2f', marginBottom: 15, fontWeight: '600', textAlign: 'center' }
});