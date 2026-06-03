import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import ProductImage from '../../components/ProductImage';
import { useAuth } from '../../context/AuthContext';
import { useCustomAlert } from '../../context/CustomAlertContext';
import { formatCurrency } from '../../services/formatters';
import * as productService from '../../services/productService';

export default function ProductListScreen({ navigation }) {
  const { logout, user } = useAuth();
  const { showConfirm } = useCustomAlert();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    setLoading(true);
    const data = await productService.getProducts();
    setProducts(data);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  function confirmDelete(product) {
    showConfirm({
      title: 'Remover produto',
      message: `Deseja remover ${product.name}? Essa ação não pode ser desfeita.`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        await productService.deleteProduct(product.id);
        loadProducts();
      },
    });
  }

  function renderProduct({ item }) {
    return (
      <Pressable onPress={() => navigation.navigate('ProductDetails', { productId: item.id })} style={styles.card}>
        <ProductImage name={item.name} sourceUrl={item.image} style={styles.productImage} />

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text numberOfLines={1} style={styles.productName}>
              {item.name}
            </Text>
            <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
          </View>

          <Text numberOfLines={2} style={styles.productDescription}>
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.quantityBadge}>
              <MaterialIcons name="inventory-2" size={15} color="#58616f" />
              <Text style={styles.productQuantity}>{item.quantity} em estoque</Text>
            </View>

            <View style={styles.actions}>
              <Pressable
                hitSlop={8}
                onPress={(event) => {
                  event.stopPropagation();
                  navigation.navigate('ProductEdit', { productId: item.id });
                }}
                style={styles.iconButton}
              >
                <MaterialIcons name="edit" size={20} color="#2563eb" />
              </Pressable>
              <Pressable
                hitSlop={8}
                onPress={(event) => {
                  event.stopPropagation();
                  confirmDelete(item);
                }}
                style={[styles.iconButton, styles.deleteIconButton]}
              >
                <MaterialIcons name="delete-outline" size={21} color="#b42318" />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name}</Text>
          <Text style={styles.screenTitle}>Produtos</Text>
        </View>

        <Pressable onPress={logout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={22} color="#424b5a" />
        </Pressable>
      </View>

      {loading ? (
        <Text style={styles.emptyText}>Carregando produtos...</Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={products}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable onPress={() => navigation.navigate('ProductCreate')} style={styles.fab}>
        <MaterialIcons name="add" size={30} color="#ffffff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 58,
    backgroundColor: '#f5f1ea',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#69707d',
  },
  screenTitle: {
    marginTop: 2,
    fontSize: 30,
    fontWeight: '800',
    color: '#20242c',
  },
  logoutButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: '#eee8df',
  },
  list: {
    paddingBottom: 96,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 14,
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eee4d8',
  },
  productImage: {
    width: 86,
    height: 96,
    borderRadius: 14,
    backgroundColor: '#ebe2d7',
  },
  cardContent: {
    flex: 1,
    paddingLeft: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#20242c',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2d7d59',
  },
  productDescription: {
    marginTop: 7,
    lineHeight: 19,
    color: '#69707d',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  quantityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 999,
    backgroundColor: '#f4f0ea',
  },
  productQuantity: {
    color: '#58616f',
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#eef4ff',
  },
  deleteIconButton: {
    backgroundColor: '#fff0ed',
  },
  emptyText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 26,
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 31,
    backgroundColor: '#2d7d59',
    shadowColor: '#1f513e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 7,
  },
});
