import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProductImage({ name, sourceUrl, style, iconSize = 28 }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [sourceUrl]);

  if (!sourceUrl || hasError) {
    return (
      <View style={[styles.fallback, style]}>
        <MaterialIcons name="image-not-supported" size={iconSize} color="#9a9186" />
        <Text numberOfLines={1} style={styles.fallbackText}>
          {name}
        </Text>
      </View>
    );
  }

  return (
    <Image
      onError={() => setHasError(true)}
      resizeMode="cover"
      source={{ uri: sourceUrl }}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#ebe2d7',
  },
  fallbackText: {
    marginTop: 6,
    paddingHorizontal: 8,
    color: '#69707d',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
