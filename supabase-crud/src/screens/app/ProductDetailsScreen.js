import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import ProductImage from '../../components/ProductImage';
import ScreenHeader from '../../components/ScreenHeader';
import { formatCurrency } from '../../services/formatters';
import * as productService from '../../services/productService';

export default function ProductDetailsScreen({ navigation, route }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProduct() {
    setLoading(true);
    const data = await productService.getProductById(route.params.productId);
    setProduct(data);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadProduct();
    }, [route.params.productId])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Detalhes do produto" onBack={() => navigation.goBack()} />
        <Text style={styles.emptyText}>Carregando produto...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Detalhes do produto" onBack={() => navigation.goBack()} />
        <Text style={styles.emptyText}>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Detalhes do produto" onBack={() => navigation.goBack()} />

      <View style={styles.card}>
        <ProductImage name={product.name} sourceUrl={product.image} style={styles.image} iconSize={42} />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.row}>
          <View style={styles.labelGroup}>
            <MaterialIcons name="payments" size={19} color="#69707d" />
            <Text style={styles.label}>Preço</Text>
          </View>
          <Text style={styles.value}>{formatCurrency(product.price)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.labelGroup}>
            <MaterialIcons name="inventory-2" size={19} color="#69707d" />
            <Text style={styles.label}>Quantidade</Text>
          </View>
          <Text style={styles.value}>{product.quantity}</Text>
        </View>
      </View>

      <Pressable onPress={() => navigation.navigate('ProductEdit', { productId: product.id })} style={styles.primaryButton}>
        <MaterialIcons name="edit" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>Editar produto</Text>
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
  card: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eee4d8',
  },
  image: {
    width: '100%',
    height: 230,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#ebe2d7',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#20242c',
  },
  description: {
    marginTop: 10,
    marginBottom: 18,
    fontSize: 16,
    lineHeight: 23,
    color: '#69707d',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: '#f0ebe4',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#69707d',
    fontWeight: '700',
  },
  value: {
    color: '#20242c',
    fontWeight: '800',
  },
  primaryButton: {
    flexDirection: 'row',
    gap: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: '#2d7d59',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
  },
});
