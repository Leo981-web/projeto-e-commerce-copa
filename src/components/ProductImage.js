import { useEffect, useState, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppText from "./AppText";

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");

export default function ProductImage({ name, sourceUrl, style, iconSize = 28 }) {
  const [hasError, setHasError] = useState(false);
  const lastUrl = useRef(null);

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
  
    if (!BASE_URL) {
      console.warn("[ProductImage] EXPO_PUBLIC_API_URL não definida. URL relativa ignorada:", url);
      return null;
    }
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${BASE_URL}${cleanUrl}`;
  };

  const finalSourceUrl = getFullImageUrl(sourceUrl);

  useEffect(() => {
   
    if (finalSourceUrl !== lastUrl.current) {
      lastUrl.current = finalSourceUrl;
      setHasError(false);
    }
  }, [finalSourceUrl]);

  if (!finalSourceUrl || hasError) {
    return (
      <View style={[styles.fallback, style]}>
        <MaterialIcons name="image-not-supported" size={iconSize} color="#9a9186" />
        <AppText numberOfLines={1} style={styles.fallbackText}>{name}</AppText>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: finalSourceUrl, cache: "force-cache" }}
      resizeMode="cover"
      style={style}
      onError={() => setHasError(true)}
    />
  );
}


const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "#e1e1e1", 
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 8, 
  },
  fallbackText: {
    color: "#9a9186",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});