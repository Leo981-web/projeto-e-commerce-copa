import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import AppText from "./AppText";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "";

export default function ProductImage({
  name,
  sourceUrl,
  style,
  iconSize = 28,
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [sourceUrl]);

  
  const getFullImageUrl = (url) => {
    if (!url) return null;
    
    
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    
    
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${BASE_URL}${cleanUrl}`;
  };

  const finalSourceUrl = getFullImageUrl(sourceUrl);

  if (!finalSourceUrl || hasError) {
    return (
      <View style={[styles.fallback, style]}>
        <MaterialIcons
          name="image-not-supported"
          size={iconSize}
          color="#9a9186"
        />
        <AppText numberOfLines={1} style={styles.fallbackText}>
          {name}
        </AppText>
      </View>
    );
  }

  return (
    <Image
      onError={() => setHasError(true)}
      resizeMode="cover"
      source={{ uri: finalSourceUrl }}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#ebe2d7",
  },
  fallbackText: {
    marginTop: 6,
    paddingHorizontal: 8,
    color: "#69707d",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
});