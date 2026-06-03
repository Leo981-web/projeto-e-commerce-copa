import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import ScreenHeader from '../../components/ScreenHeader';
import { useCustomAlert } from '../../context/CustomAlertContext';
import { parseCurrencyInput } from '../../services/formatters';
import * as productService from '../../services/productService';

export default function ProductCreateScreen({ navigation }) {
  const { showAlert } = useCustomAlert();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');

  async function handleSubmit() {
    if (!name || !description || !price || !quantity || !image) {
      showAlert({
        title: 'Campos obrigatórios',
        message: 'Preencha todos os campos do produto.',
        type: 'warning',
      });
      return;
    }

    const parsedPrice = parseCurrencyInput(price);
    const parsedQuantity = Number(quantity);

    if (
      Number.isNaN(parsedPrice) ||
      Number.isNaN(parsedQuantity) ||
      !Number.isInteger(parsedQuantity) ||
      parsedPrice < 0 ||
      parsedQuantity < 0
    ) {
      showAlert({
        title: 'Dados inválidos',
        message: 'Informe um preço válido e uma quantidade inteira. Os valores não podem ser negativos.',
        type: 'danger',
      });
      return;
    }

    await productService.createProduct({ name, description, price, quantity, image });
    showAlert({
      title: 'Produto cadastrado',
      message: 'O produto foi salvo com sucesso.',
      type: 'success',
      buttonText: 'Voltar para a lista',
      onClose: () => navigation.goBack(),
    });
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Novo produto" onBack={() => navigation.goBack()} />

      <Text style={styles.label}>Nome</Text>
      <TextInput onChangeText={setName} placeholder="Nome do produto" style={styles.input} value={name} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        multiline
        onChangeText={setDescription}
        placeholder="Descrição do produto"
        style={[styles.input, styles.textArea]}
        value={description}
      />

      <Text style={styles.label}>Preço (R$)</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={setPrice}
        placeholder="0,00"
        style={styles.input}
        value={price}
      />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={setQuantity}
        placeholder="0"
        style={styles.input}
        value={quantity}
      />

      <Text style={styles.label}>Imagem</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="url"
        onChangeText={setImage}
        placeholder="https://exemplo.com/produto.jpg"
        style={styles.input}
        value={image}
      />

      <Pressable onPress={handleSubmit} style={styles.primaryButton}>
        <MaterialIcons name="save" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>Salvar produto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 58,
    backgroundColor: '#f5f1ea',
  },
  label: {
    marginBottom: 6,
    fontWeight: '700',
    color: '#20242c',
  },
  input: {
    minHeight: 48,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee4d8',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  textArea: {
    minHeight: 96,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  primaryButton: {
    flexDirection: 'row',
    gap: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: '#2d7d59',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
