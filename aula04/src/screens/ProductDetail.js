import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { getProductById } from "../services/productService";

export default function ProductDetail({ navigation, route }) {
  const { id } = route.params;
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Detalhes do Produto",
    });
  }, []);

  useEffect(() => {
    getItem();
  }, []);

  async function getItem() {
    setLoading(true);
    try {
      const response = await getProductById(id);
      setItem(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // garante que para mesmo se der erro
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: item?.thumbnail }}
        resizeMode="cover"
      />

      <View style={styles.body}>
        <View style={styles.tagsRow}>
          {item?.tags?.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          <View style={[styles.tag, styles.tagDanger]}>
            <Text style={[styles.tagText, styles.tagTextDanger]}>
              {item?.availabilityStatus}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.brand}>
          {item?.brand} · SKU: {item?.sku}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${item?.price}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{item?.discountPercentage?.toFixed(0)}% off
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{item?.description}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avaliação</Text>
            <Text style={styles.statValue}>{item?.rating}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Estoque</Text>
            <Text style={styles.statValue}>{item?.stock} un.</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Mín. pedido</Text>
            <Text style={styles.statValue}>
              {item?.minimumOrderQuantity} un.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoTable}>
          {[
            ["Garantia", item?.warrantyInformation],
            ["Entrega", item?.shippingInformation],
            ["Devolução", item?.returnPolicy],
            ["Peso", `${item?.weight} kg`],
          ].map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Avaliações</Text>
        {item?.reviews?.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewName}>{review.reviewerName}</Text>
              <Text
                style={[
                  styles.reviewRating,
                  review.rating >= 4 ? styles.ratingGood : styles.ratingBad,
                ]}
              >
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)} {review.rating}/5
              </Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Adicionar ao carrinho</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: "100%", aspectRatio: 1, backgroundColor: "#f5f5f5" },

  body: { padding: 16 },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: "#EEEDFE",
  },
  tagText: { fontSize: 11, color: "#3C3489" },
  tagDanger: { backgroundColor: "#FCEBEB" },
  tagTextDanger: { color: "#791F1F" },

  title: { fontSize: 20, fontWeight: "600", color: "#1a1a1a", marginBottom: 2 },
  brand: { fontSize: 13, color: "#888", marginBottom: 12 },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  price: { fontSize: 26, fontWeight: "700", color: "#1a1a1a" },
  discountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: "#EAF3DE",
  },
  discountText: { fontSize: 12, color: "#27500A" },

  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 16,
  },

  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  statLabel: { fontSize: 11, color: "#888", marginBottom: 3 },
  statValue: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },

  divider: { height: 0.5, backgroundColor: "#e0e0e0", marginVertical: 16 },

  infoTable: { gap: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { fontSize: 13, color: "#888" },
  infoValue: { fontSize: 13, color: "#1a1a1a" },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
  },

  reviewCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewName: { fontSize: 13, fontWeight: "600", color: "#1a1a1a" },
  reviewRating: { fontSize: 12 },
  ratingGood: { color: "#3B6D11" },
  ratingBad: { color: "#A32D2D" },
  reviewComment: { fontSize: 13, color: "#555" },

  button: {
    marginTop: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { fontSize: 15, fontWeight: "600", color: "#fff" },
});
