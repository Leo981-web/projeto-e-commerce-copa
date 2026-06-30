import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ProductImage from "../../components/ProductImage";
import AppText from "../../components/AppText";
import Loading from "../../components/Loading";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useHistory } from "../../context/HistoryContext";
import { formatCurrency } from "../../services/formatters";

const WHITE = "#FFFFFF";
const REVIEWS_STORAGE_KEY = "@product_reviews";

function Stars({ value, onChange, size = 22, color, mutedColor }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          hitSlop={8}
          onPress={() => onChange(n)}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={n <= value ? "star" : "star-border"}
            size={size}
            color={n <= value ? color : mutedColor}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReviewCard({ item, theme, t, savedReview, onSubmit }) {
  const [rating, setRating] = useState(savedReview?.rating ?? 0);
  const [comment, setComment] = useState(savedReview?.comment ?? "");

  // ✅ CORREÇÃO: sincroniza o estado quando savedReview chega após o carregamento assíncrono
  useEffect(() => {
    if (savedReview) {
      setRating(savedReview.rating ?? 0);
      setComment(savedReview.comment ?? "");
    }
  }, [savedReview]);

  const isUpdate = Boolean(savedReview);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.divider },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.imageWrap, { backgroundColor: theme.iconBg }]}>
          <ProductImage
            name={item.name}
            sourceUrl={item.image}
            style={styles.image}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppText
            numberOfLines={2}
            style={[styles.productName, { color: theme.textPrimary }]}
          >
            {item.name}
          </AppText>
          <Text style={[styles.productPrice, { color: theme.navActive }]}>
            {formatCurrency(item.price)}
          </Text>
        </View>
      </View>

      <Text style={[styles.ratingLabel, { color: theme.textMuted }]}>
        {t("reviewsYourRating")}
      </Text>
      <Stars
        value={rating}
        onChange={setRating}
        color={theme.navActive}
        mutedColor={theme.divider}
      />

      <TextInput
        style={[
          styles.commentInput,
          {
            backgroundColor: theme.iconBg,
            color: theme.textPrimary,
            borderColor: theme.divider,
          },
        ]}
        placeholder={t("reviewsCommentPlaceholder")}
        placeholderTextColor={theme.textMuted}
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: rating > 0 ? theme.navActive : theme.divider },
        ]}
        disabled={rating === 0}
        activeOpacity={0.85}
        onPress={() => onSubmit(item.id, { rating, comment })}
      >
        <MaterialIcons name="check" size={16} color={WHITE} />
        <Text style={styles.submitBtnText}>
          {isUpdate ? t("reviewsUpdateButton") : t("reviewsSubmitButton")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ReviewsScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { showAlert } = useCustomAlert();
  const { history, loading: historyLoading } = useHistory();

  const [reviews, setReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const stored = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
          setReviews(stored ? JSON.parse(stored) : {});
        } finally {
          setLoadingReviews(false);
        }
      })();
    }, []),
  );

  async function handleSubmitReview(productId, data) {
    const updated = {
      ...reviews,
      [productId]: { ...data, date: new Date().toISOString() },
    };
    setReviews(updated);
    await AsyncStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    showAlert({
      title: t("reviewsSavedTitle"),
      message: t("reviewsSavedMessage"),
      type: "success",
    });
  }

  const purchasedProducts = [];
  const seen = new Set();
  (history || []).forEach((order) => {
    (order.items || []).forEach((item) => {
      if (item?.id && !seen.has(item.id)) {
        seen.add(item.id);
        purchasedProducts.push(item);
      }
    });
  });

  const loading = historyLoading || loadingReviews;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.bg}
        />
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.bg}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.iconBg }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTexts}>
          <Text style={[styles.headerTitle, { color: theme.titlePrimary }]}>
            {t("reviewsScreenTitle")}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
            {t("reviewsScreenSubtitle")}
          </Text>
        </View>
      </View>

      {purchasedProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="star-outline" size={64} color={theme.divider} />
          <Text style={[styles.emptyTitle, { color: theme.titlePrimary }]}>
            {t("reviewsEmptyTitle")}
          </Text>
          <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
            {t("reviewsEmptyDesc")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={purchasedProducts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ReviewCard
              key={`${item.id}-${reviews[item.id] ? "reviewed" : "new"}`}
              item={item}
              theme={theme}
              t={t}
              savedReview={reviews[item.id]}
              onSubmit={handleSubmitReview}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTexts: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  emptyDesc: { fontSize: 13, textAlign: "center", maxWidth: 280 },
  list: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 40 },
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 14,
  },
  cardTop: { flexDirection: "row", gap: 12, marginBottom: 14 },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: { width: 56, height: 56, borderRadius: 10 },
  productName: { fontSize: 14, fontWeight: "800" },
  productPrice: { fontSize: 13, fontWeight: "800", marginTop: 4 },
  ratingLabel: { fontSize: 12, fontWeight: "700", marginBottom: 8 },
  commentInput: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: "top",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitBtnText: { color: WHITE, fontSize: 13, fontWeight: "800" },
});
