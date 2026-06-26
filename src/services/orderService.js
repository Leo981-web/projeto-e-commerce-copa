import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function getAuthHeader() {
  const token = await AsyncStorage.getItem('@ECommerceCopa:token');
  const userString = await AsyncStorage.getItem('@ECommerceCopa:user');
  const user = userString ? JSON.parse(userString) : null;

  let userTypeStr = '0';
  if (user && user.type !== undefined) {
    if (user.type === 'Admin' || user.type === 'ADMIN') userTypeStr = '0';
    else if (user.type === 'Common' || user.type === 'COMMON') userTypeStr = '1';
    else userTypeStr = String(user.type);
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-User-Id': user?.id ? String(user.id) : '1',
    'X-User-Email': user?.email ? user.email : 'admin@admin.com',
    'X-User-Type': userTypeStr,
  };
}

function mapOrderItem(item) {
  const product = item.product || {};
  const name = `${product.brand || ''} ${product.model || ''}`.trim() || product.description || '';
  const price = item.convertedPriceAtPruchase > 0 ? item.convertedPriceAtPruchase : item.priceAtPurchase;

  return {
    id: item.productId,
    name,
    description: product.description || '',
    price: Number(price),
    quantity: item.quantity,
    image: product.imageUrl || product.imageURL || '',
    cartQuantity: item.quantity,
    productId: item.productId,
  };
}

function mapOrder(order) {
  return {
    id: String(order.id),
    orderId: order.id,
    date: order.orderDate,
    total: order.totalConvertedPrice > 0 ? order.totalConvertedPrice : order.totalPrice,
    totalPrice: order.totalPrice,
    totalConvertedPrice: order.totalConvertedPrice,
    items: (order.items || []).map(mapOrderItem),
    customerId: order.customerId,
  };
}

export async function createOrder(cartItems) {
  const headers = await getAuthHeader();

  const payload = {
    items: cartItems.map(item => ({
      productId: item.id,
      quantity: item.cartQuantity || 1,
    })),
  };

  const response = await fetch(`${API_URL}/ws/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro HTTP: ${response.status}`);
  }

  const data = await response.json();
  return mapOrder(data);
}

export async function getOrders(targetCurrency = 'BRL') {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_URL}/ws/orders?targetCurrency=${targetCurrency}&size=100&sort=orderDate,desc`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro HTTP: ${response.status}`);
  }

  const data = await response.json();
  const orders = data.content || data;
  return orders.map(mapOrder);
}
