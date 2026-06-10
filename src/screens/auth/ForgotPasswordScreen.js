import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from '../../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  async function handleResetRequest() {
    setErrorMessage('');

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, informe um e-mail válido.");
      return; 
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      
      
      navigation.navigate("ResetPassword");
    } catch (error) {
      setErrorMessage(error.message); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      
      <TextInput
        style={[styles.input, errorMessage ? styles.inputError : null]}
        placeholder="Digite o seu e-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMessage(''); 
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />

     
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.buttonSpacing}>
        <Button 
          title={loading ? "A enviar..." : "Enviar link de recuperação"} 
          onPress={handleResetRequest} 
          disabled={loading}
          style={styles.button}
        />
      </View>
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#cbd5e1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: "#f5f1ea" },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1A237E' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 8, backgroundColor: '#fff', fontFamily: 'Arial' },
  inputError: { borderColor: '#d32f2f', borderWidth: 2 }, // Borda vermelha se der erro
  errorText: { color: '#d32f2f', marginBottom: 15, fontWeight: '600', textAlign: 'center' },
  buttonSpacing: { marginBottom: 10 },
});