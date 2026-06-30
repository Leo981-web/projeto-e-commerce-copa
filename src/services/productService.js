import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function parseCurrency(value) {
  if (typeof value === "number") return value;
  const textValue = String(value).trim();
  if (textValue.includes(",")) {
    return Number(textValue.replace(/\./g, "").replace(",", "."));
  }
  return Number(textValue);
}

export function mapProduct(product) {
  if (!product) return null;

  const finalPrice =
    product.convertedPrice && product.convertedPrice > 0
      ? product.convertedPrice
      : product.price;

  return {
    id: product.id,
    name:
      `${product.brand || ""} ${product.model || ""}`.trim() ||
      product.description,
    description: product.description,
    price: Number(finalPrice),
    quantity: Number(product.stock),
    image: product.imageUrl || product.imageURL || null,
  };
}

function mapToDTO(productData) {
  const rawStock =
    productData.quantity !== undefined
      ? productData.quantity
      : productData.stock;
  const finalStock = rawStock ? Number(rawStock) : 0;

  const finalImage =
    productData.imageURL || productData.imageUrl || productData.image || null;

  return {
    brand: "Geral",
    model: productData.name,
    description: productData.description,
    price: parseCurrency(productData.price),
    stock: finalStock,
    imageURL: finalImage,
    currency: "BRL",
  };
}

async function getAuthHeader() {
  const token = await AsyncStorage.getItem("@ECommerceCopa:token");
  const userString = await AsyncStorage.getItem("@ECommerceCopa:user");

  const user = userString ? JSON.parse(userString) : null;

  if (!token) {
    console.warn("Nenhum token encontrado no AsyncStorage!");
  }

  let userTypeStr = "0";
  if (user && user.type !== undefined) {
    if (user.type === "Admin" || user.type === "ADMIN") userTypeStr = "0";
    else if (user.type === "Common" || user.type === "COMMON")
      userTypeStr = "1";
    else userTypeStr = String(user.type);
  }

  return {
    Authorization: `Bearer ${token}`,
    "X-User-Id": user?.id ? String(user.id) : "1",
    "X-User-Email": user?.email ? user.email : "admin@admin.com",
    "X-User-Type": userTypeStr,
  };
}

export async function getProducts() {
  const authHeader = await getAuthHeader();

  try {
    const response = await fetch(
      `${API_URL}/products?size=100&targetCurrency=BRL`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro HTTP: ${response.status} - ${errorBody}`);
    }
    const data = await response.json();

    const productList = data.content ? data.content : data;
    return productList.map(mapProduct);
  } catch (error) {
    throw new Error("Erro ao buscar os produtos: " + error.message);
  }
}

export async function getProductById(id) {
  try {
    const response = await fetch(
      `${API_URL}/products/${id}?targetCurrency=BRL`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    const data = await response.json();
    return mapProduct(data);
  } catch (error) {
    throw new Error("Erro ao buscar o produto: " + error.message);
  }
}
export async function createProduct(productData) {
  const payload = mapToDTO(productData);
  const authHeader = await getAuthHeader();

  try {
    const response = await fetch(`${API_URL}/ws/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return mapProduct(data);
  } catch (error) {
    throw new Error("Erro ao cadastrar: " + error.message);
  }
}

export async function updateProduct(id, productData) {
  const payload = mapToDTO(productData);
  const authHeader = await getAuthHeader();

  try {
    const response = await fetch(`${API_URL}/ws/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return mapProduct(data);
  } catch (error) {
    throw new Error("Erro ao atualizar: " + error.message);
  }
}

export async function deleteProduct(id) {
  const authHeader = await getAuthHeader();

  try {
    const response = await fetch(`${API_URL}/ws/products/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeader,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (
        errorText.includes("Unexpected row count") ||
        errorText.includes("expected row count 1 but was 0")
      ) {
        console.warn(
          `Aviso: O produto ID ${id} já não existia no banco de dados.`,
        );
        return true;
      }

      throw new Error(errorText || `Erro HTTP: ${response.status}`);
    }

    return true;
  } catch (error) {
    throw new Error("Erro ao deletar: " + error.message);
  }
}

export async function checkoutCart(cartItems) {
  try {
    for (const item of cartItems) {
      const currentStock =
        item.quantity !== undefined ? item.quantity : item.stock || 0;
      const newStock = Math.max(currentStock - item.cartQuantity, 0);
      await updateProduct(item.id, {
        ...item,
        quantity: newStock,
      });
    }
    return true;
  } catch (error) {
    throw new Error(
      "Erro ao atualizar o estoque no checkout: " + error.message,
    );
  }
}
