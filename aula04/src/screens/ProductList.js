import { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getProducts } from "../services/productService";

export default function ProductList({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Lista de Produtos",
      headerTitleAlign: "center",
      headerLeft: () => {
        return <Button title="Logout" />;
      },
      headerRight: () => {
        return <Button title="Grupo" />;
      },
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getItems();
    setLoading(false);
  }, []);

  async function getItems() {
    const response = await getProducts();
    setItems(response.data);
    console.log(response);
  }

  if (loading) {
    <View style={styles.container}>
      <ActivityIndicator size={"large"} />
    </View>;
  }

  /*return (
    <ScrollView style={styles.containerScroll}>
      <View style={styles.grid}>
        {items.map((produto) => (
          <View key={produto.id} style={styles.card}>
            <Image
              style={styles.cardImage}
              source={{ uri: produto.imageUrl }}
              resizeMode="cover"
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {produto.title}
              </Text>
              <Text style={styles.cardPrice}>{produto.price}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );*/

  return (
    <View style={styles.containerScroll}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("ProductDetail", {
                id: item.id,
              })
            }
          >
            <Image
              style={styles.cardImage}
              source={{ uri: item.imageUrl }}
              resizeMode="cover"
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  containerScroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f5f5f5",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  cardBody: {
    padding: 10,
  },
});
