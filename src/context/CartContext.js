import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    const existingProduct = cart.find((item) => item.id === product.id);
    const currentQty = existingProduct ? existingProduct.cartQuantity : 0;

    const stockAvailable = product.stock !== undefined ? product.stock : 5;

    if (currentQty >= stockAvailable) {
      return false;
    }

    setCart((prevCart) => {
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, cartQuantity: 1 }];
    });

    return true;
  }

  function removeFromCart(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, amount) {
    const product = cart.find((item) => item.id === productId);
    if (!product) return "error";

    const newQuantity = product.cartQuantity + amount;
    const stockAvailable = product.stock !== undefined ? product.stock : 5;

    if (amount > 0 && newQuantity > stockAvailable) {
      return "max_reached"; 
    }

    if (newQuantity < 1) {
      return "min_reached"; 
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, cartQuantity: newQuantity } : item,
      ),
    );

    return "success";
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce(
    (acc, item) => acc + (item.cartQuantity || 1),
    0,
  );
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * (item.cartQuantity || 1),
    0,
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
