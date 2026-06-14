import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "./AuthContext";

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const storageKey = user?.id ? `favorites:${user.id}` : "favorites:guest";
        const rawFavorites = await AsyncStorage.getItem(storageKey);

        if (rawFavorites) {
          const parsedFavorites = JSON.parse(rawFavorites);
          setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
        } else {
          setFavorites([]);
        }
      } catch {
        setFavorites([]);
      }
    }

    loadFavorites();
  }, [user?.id]);

  useEffect(() => {
    async function saveFavorites() {
      try {
        const storageKey = user?.id ? `favorites:${user.id}` : "favorites:guest";
        await AsyncStorage.setItem(storageKey, JSON.stringify(favorites));
      } catch {
      }
    }

    saveFavorites();
  }, [favorites, user?.id]);

  function toggleFavorite(product) {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((favorite) => favorite.id === product.id);

      if (isAlreadyFavorite) {
        return prevFavorites.filter((favorite) => favorite.id !== product.id);
      }

      return [...prevFavorites, product];
    });
  }

  function isFavorite(productId) {
    return favorites.some((favorite) => favorite.id === productId);
  }

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [favorites],
  );

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error("useFavorites deve ser usado dentro de FavoriteProvider.");
  }

  return context;
}