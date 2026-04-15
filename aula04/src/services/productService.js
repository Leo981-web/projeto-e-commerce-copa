import api from "./api";

export async function getProducts() {
  try {
    const response = await api.get("/products");
    const products = response.data.products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.thumbnail,
    }));

    return {
      data: products,
      success: true,
    };
  } catch (error) {
    console.error(error.message);
    return {
      data: null,
      success: false,
      errorMessage: "Ocorreu um erro",
    };
  }
}

export async function getProductById(id) {
  try {
    const response = await api.get(`/products/${id}`);

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    console.error(error.message);
    return {
      data: null,
      success: false,
      errorMessage: "Ocorreu um erro",
    };
  }
}
