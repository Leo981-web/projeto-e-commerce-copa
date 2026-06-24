import { useCallback, useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import EmptyStateImage from "../../assets/empty_state.svg";
import AppText from "../../components/AppText";
import ProductImage from "../../components/ProductImage";
import { useAuth } from "../../context/AuthContext";      
import { useCart } from "../../context/CartContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { useLanguage } from "../../context/LanguageContext";
import { formatCurrency } from "../../services/formatters";
import * as productService from "../../services/productService";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoriteContext";

const { width } = Dimensions.get("window");

const GREEN      = "#15622A";
const GREEN_DARK = "#0D4A1A";
const GREEN_MID  = "#22C55E";
const GOLD       = "#F5C518";
const RED_LIVE   = "#EF4444";

const COUNTRY_THEMES = [
  { bg: "#D4EDDA", accent: "#009C3B", flag: "🇧🇷" },
  { bg: "#D6E8F5", accent: "#1565C0", flag: "🇦🇷" },
  { bg: "#DDEAF7", accent: "#002395", flag: "🇫🇷" },
  { bg: "#E8E8E8", accent: "#333333", flag: "🇩🇪" },
  { bg: "#D4EDDA", accent: "#006600", flag: "🇵🇹" },
  { bg: "#F7DADA", accent: "#AA151B", flag: "🇪🇸" },
];

const getHeroBanners = (t) => [
  {
    title: t("bannerTitle1"),
    sub: t("bannerSub1"),
    cta: t("bannerCta1"),
    accent: GOLD,
    image: require("../../assets/card1.jpeg"),
  },
  {
    title: t("bannerTitle2"),
    sub: t("bannerSub2"),
    cta: t("bannerCta2"),
    accent: GREEN_MID,
    image: require("../../assets/card2.jpeg"),
  },
  {
    title: t("bannerTitle3"),
    sub: t("bannerSub3"),
    cta: t("bannerCta3"),
    accent: "#60A5FA",
    image: require("../../assets/card3.jpeg"),
  },
];

const FILTER_KEYS = [
  "filterAll",
  "filterShirts",
  "filterShoes",
  "filterAccessories",
  "filterStickers",
  "filterOthers",
];

const FILTER_META = {
  filterAll:         { icon: "apps" },
  filterShirts:      { icon: "checkroom" },
  filterShoes:       { icon: "directions-run" },
  filterAccessories: { icon: "watch" },
  filterStickers:    { icon: "auto-awesome" },
  filterOthers:      { icon: "more-horiz" },
};

function buildNavItems(isAdmin) {
  return [
    { key: "home",      icon: "home",   iconOff: "home-outline",   labelKey: "navHome"      },
    { key: "favorites", icon: "heart",  iconOff: "heart-outline",  labelKey: "navFavorites" },
    { key: "create",    center: true,   adminOnly: true            },   // oculto para Common
    { key: "cart",      icon: "cart",   iconOff: "cart-outline",   labelKey: "navCart"      },
    { key: "profile",   icon: "person", iconOff: "person-outline", labelKey: "navProfile"   },
  ].filter((tab) => !tab.adminOnly || isAdmin);
}

// ─────────────────────────────────────────────────────────────────────────────
function HeroCarousel({ t }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);
  const banners = getHeroBanners(t);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        setActive((prev) => {
          const next = (prev + 1) % banners.length;
          scrollRef.current?.scrollTo({ x: next * (width - 40), animated: true });
          return next;
        });
      }, 3500);
      return () => clearInterval(interval);
    }, [banners.length])
  );

  function onScroll(e) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
    setActive(idx);
  }

  return (
    <View style={carouselStyles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        style={{ borderRadius: 14 }}
        contentContainerStyle={{ borderRadius: 14 }}
      >
        {banners.map((b, i) => (
          <View key={i} style={[carouselStyles.slide, { width: width - 40 }]}>
            <Image source={b.image} style={carouselStyles.bgImage} />
            <View style={carouselStyles.overlay} />
            <View style={carouselStyles.content}>
              <Text style={[carouselStyles.title, { color: b.accent }]}>{b.title}</Text>
              <Text style={carouselStyles.sub}>{b.sub}</Text>
              <TouchableOpacity style={[carouselStyles.cta, { backgroundColor: b.accent }]}>
                <Text style={carouselStyles.ctaText}>{b.cta}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={carouselStyles.dots}>
        {banners.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              scrollRef.current?.scrollTo({ x: i * (width - 40), animated: true });
              setActive(i);
            }}
            style={[
              carouselStyles.dot,
              {
                width: i === active ? 18 : 5,
                backgroundColor: i === active
                  ? banners[active].accent
                  : "rgba(255,255,255,0.38)",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const carouselStyles = StyleSheet.create({
  wrap:    { marginHorizontal: 20, marginBottom: 14, borderRadius: 14, overflow: "hidden", height: 200 },
  slide:   { height: 200, borderRadius: 14, overflow: "hidden", position: "relative" },
  bgImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%", resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.47)" },
  content: { position: "absolute", top: 0, left: 0, bottom: 0, justifyContent: "center", paddingHorizontal: 22, paddingVertical: 20, maxWidth: "68%" },
  title:   { fontSize: 28, fontWeight: "900", lineHeight: 26, marginBottom: 8 },
  sub:     { fontSize: 11, color: "rgba(255,255,255,0.82)", lineHeight: 16, marginBottom: 14 },
  cta:     { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  ctaText: { fontSize: 11, fontWeight: "800", color: "#0D1B0F", textTransform: "uppercase", letterSpacing: 0.6 },
  dots:    { position: "absolute", bottom: 12, right: 16, flexDirection: "row", gap: 5, alignItems: "center" },
  dot:     { height: 5, borderRadius: 3 },
});

// ─────────────────────────────────────────────────────────────────────────────
function LiveScore({ t }) {
  const blink = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(blink, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          Animated.timing(blink, { toValue: 1,   duration: 600, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }, [blink])
  );

  return (
    <View style={liveStyles.wrap}>
      <Animated.Text style={[liveStyles.badge, { opacity: blink }]}>● {t("liveScoreBadge")}</Animated.Text>
      <View style={liveStyles.row}>
        <Text style={liveStyles.team}>🇧🇷 BRA</Text>
        <Text style={liveStyles.score}>2 — 1</Text>
        <Text style={liveStyles.team}>ARG 🇦🇷</Text>
        <Text style={liveStyles.time}> • 73'</Text>
      </View>
    </View>
  );
}

const liveStyles = StyleSheet.create({
  wrap:  { marginHorizontal: 20, marginBottom: 14, paddingHorizontal: 25, paddingVertical: 11, borderRadius: 10, backgroundColor: GREEN_DARK, borderWidth: 1, borderColor: "rgba(245,197,24,0.18)", flexDirection: "row", alignItems: "center", gap: 25 },
  badge: { fontSize: 10, fontWeight: "700", letterSpacing: 0.8, color: RED_LIVE },
  row:   { flexDirection: "row", alignItems: "center", gap: 8 },
  team:  { fontSize: 12, fontWeight: "700", color: "#fff" },
  score: { fontSize: 17, fontWeight: "700", color: GOLD, fontVariant: ["tabular-nums"] },
  time:  { fontSize: 11, color: "rgba(255,255,255,0.5)", fontVariant: ["tabular-nums"] },
});

// ─────────────────────────────────────────────────────────────────────────────
// Tela Principal
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductListScreen({ navigation }) {
  const { logout, user, isAdmin } = useAuth();   // ← isAdmin aqui
  const { showAlert, showConfirm } = useCustomAlert();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { addToCart, totalItems, cart } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const styles = makeStyles(theme);

  const [loading, setLoading]           = useState(true);
  const [products, setProducts]         = useState([]);
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("filterAll");
  const [activeNav, setActiveNav]       = useState("home");

  const NAV_ITEMS = buildNavItems(isAdmin);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      showAlert({ title: t("loadProductsErrorTitle"), message: error.message, type: "danger" });
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      setActiveNav("home");
    }, [])
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => {
      const name = p.name?.toLowerCase() ?? "";
      const desc = p.description?.toLowerCase() ?? "";
      return name.includes(term) || desc.includes(term);
    });
  }, [products, search]);

  function confirmDelete(product) {
    showConfirm({
      title: t("deleteProductTitle"),
      message: `${t("deleteProductConfirm1")} ${product.name}? ${t("deleteProductConfirm2")}`,
      confirmText: t("deleteButton"),
      cancelText: t("cancel"),
      type: "danger",
      onConfirm: async () => {
        try {
          await productService.deleteProduct(product.id);
          loadProducts();
        } catch (error) {
          showAlert({ title: t("deleteErrorTitle"), message: error.message, type: "danger" });
        }
      },
    });
  }

  function renderEmptyList() {
    return (
      <View style={styles.emptyState}>
        <EmptyStateImage width={200} height={150} />
        <Text style={styles.emptyTitle}>{t("emptyProductsTitle")}</Text>
        <Text style={styles.emptyDesc}>{t("emptyProductsDesc")}</Text>
      </View>
    );
  }

  function renderProduct({ item, index }) {
    const countryTheme   = COUNTRY_THEMES[index % COUNTRY_THEMES.length];
    const cartItem       = cart.find((c) => c.id === item.id);
    const quantityInCart = cartItem ? cartItem.cartQuantity : 0;
    const availableQty   = item.quantity - quantityInCart;
    const isFav          = isFavorite(item.id);

    const stockRatio   = item.quantity > 0 ? availableQty / item.quantity : 0;
    const stockPercent = Math.min(Math.max(stockRatio, 0), 1) * 100;
    const stockColor   =
      stockRatio <= 0.2 ? theme.textDestructive
      : stockRatio <= 0.5 ? GOLD
      : GREEN_MID;

    return (
      <Pressable
        onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardImageWrap}>
          <ProductImage name={item.name} sourceUrl={item.image} style={styles.productImage} />
          <View style={[styles.flagBadge, { backgroundColor: countryTheme.bg }]}>
            <Text style={styles.flagBadgeText}>{countryTheme.flag}</Text>
          </View>
          <Pressable
            hitSlop={8}
            onPress={(e) => { e.stopPropagation(); toggleFavorite(item); }}
            style={styles.favoriteOverlay}
          >
            <MaterialIcons
              name={isFav ? "favorite" : "favorite-border"}
              size={15}
              color={isFav ? "#FF3B6F" : "#FFFFFF"}
            />
          </Pressable>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <AppText numberOfLines={1} style={styles.productName}>{item.name}</AppText>
            <AppText style={[styles.productPrice, { color: countryTheme.accent }]}>
              {formatCurrency(item.price)}
            </AppText>
          </View>

          <AppText numberOfLines={2} variant="muted" style={styles.productDescription}>
            {item.description}
          </AppText>

          <View style={styles.stockRow}>
            <View style={styles.stockTrack}>
              <View style={[styles.stockFill, { width: `${stockPercent}%`, backgroundColor: stockColor }]} />
            </View>
            <Text style={[styles.stockLabel, { color: stockColor }]}>
              {availableQty} {t("inStock")}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            {/* Botão de compra: visível apenas para Common */}
            {!isAdmin && (
              <Pressable
                hitSlop={8}
                onPress={(e) => {
                  e.stopPropagation();
                  const added = addToCart({ ...item, stock: item.quantity });
                  if (!added) {
                    showAlert({ title: t("opsTitle"), message: t("stockLimitMessage"), type: "danger" });
                  }
                }}
                style={({ pressed }) => [styles.addToCartBtn, pressed && { opacity: 0.8 }]}
              >
                <MaterialIcons name="add-shopping-cart" size={14} color="#FFFFFF" />
              </Pressable>
            )}

            {/* Botões de edição e exclusão: visíveis apenas para Admin */}
            {isAdmin && (
              <View style={styles.secondaryActions}>
                <Pressable
                  hitSlop={8}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate("ProductEdit", { productId: item.id });
                  }}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="edit" size={15} color={theme.titlePrimary} />
                </Pressable>
                <Pressable
                  hitSlop={8}
                  onPress={(e) => { e.stopPropagation(); confirmDelete(item); }}
                  style={[styles.iconButton, styles.deleteIconButton]}
                >
                  <MaterialIcons name="delete-outline" size={16} color={theme.textDestructive} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/logo.png")} style={styles.logoImage} />
          <Text style={styles.headerTitle}>
            <Text style={{ color: GREEN }}>Gol</Text>
            <Text style={{ color: GOLD }}>Up</Text>
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} onPress={() => navigation.navigate("Notification")}>
            <MaterialIcons name="notifications-none" size={22} color={theme.titlePrimary} />
            <View style={styles.notifDot} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => navigation.navigate("Settings")}>
            <MaterialIcons name="settings" size={22} color={theme.titlePrimary} />
          </Pressable>
        </View>
      </View>

      {/* ── BUSCA ──────────────────────────────────────────────────────────── */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchPlaceholder")}
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <HeroCarousel t={t} />
      <LiveScore t={t} />

      <Text style={styles.customSectionTitle}>
        {t("callout1")}{" "}
        <Text style={{ color: GREEN_MID }}>{t("calloutCopa")}</Text>{" "}
        {t("callout2")}{" "}
        <EvilIcons name="trophy" size={23} color={GOLD} />
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {FILTER_KEYS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {t(f)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>{t("productsSectionTitle")}</Text>
        <Text style={styles.productsCount}>{filteredProducts.length} {t("itemsCount")}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={GREEN} size="large" />
          <Text style={styles.loadingText}>{t("loadingProductsText")}</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyList}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── BOTTOM NAV ─────────────────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, tab.center && styles.navItemCenter]}
            onPress={() => {
              setActiveNav(tab.key);
              if (tab.key === "create")    navigation.navigate("ProductCreate");
              if (tab.key === "profile")   navigation.navigate("Profile");
              if (tab.key === "cart")      navigation.navigate("Cart");
              if (tab.key === "favorites") navigation.navigate("Favorites");
            }}
          >
            {tab.center ? (
              <View style={styles.navCreateBtn}>
                <Ionicons name="add" size={26} color={GREEN_DARK} />
              </View>
            ) : (
              <>
                <View style={[styles.navIconWrap, activeNav === tab.key && styles.navIconWrapActive]}>
                  <Ionicons
                    name={activeNav === tab.key ? tab.icon : tab.iconOff}
                    size={20}
                    color={activeNav === tab.key ? GREEN : theme.navInactive}
                  />
                  {tab.key === "cart" && totalItems > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{totalItems}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.navLabel, activeNav === tab.key && styles.navLabelActive]}>
                  {t(tab.labelKey)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const makeStyles = (theme) =>
  StyleSheet.create({
    safe:              { flex: 1, backgroundColor: theme.card },
    header:            { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 },
    logoContainer:     { flexDirection: "row", alignItems: "center", gap: 10 },
    logoImage:         { width: 45, height: 45, resizeMode: "contain" },
    headerTitle:       { fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
    headerActions:     { flexDirection: "row", gap: 8 },
    iconBtn:           { width: 42, height: 42, borderRadius: 10, backgroundColor: theme.card, alignItems: "center", justifyContent: "center", position: "relative", borderWidth: 1, borderColor: theme.divider },
    notifDot:          { position: "absolute", top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: RED_LIVE, borderWidth: 1.5, borderColor: theme.bg ?? "#fff" },
    searchRow:         { paddingHorizontal: 20, marginBottom: 14 },
    searchBox:         { flexDirection: "row", alignItems: "center", backgroundColor: theme.card, borderRadius: 10, paddingHorizontal: 14, height: 46, borderWidth: 1.5, borderColor: theme.divider },
    searchInput:       { flex: 1, fontSize: 13, color: theme.textPrimary },
    sectionTitle:      { fontSize: 15, fontWeight: "900", color: theme.titlePrimary, letterSpacing: 0.5, marginBottom: 10 },
    customSectionTitle:{ fontSize: 16, fontWeight: "800", color: theme.titlePrimary, paddingHorizontal: 20, marginBottom: 12 },
    productsHeader:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 10, marginTop: 6 },
    productsCount:     { fontSize: 14, color: theme.textMuted, fontWeight: "700" },
    filtersScroll:     { maxHeight: 72, marginBottom: 14 },
    filtersRow:        { paddingHorizontal: 20, gap: 8, alignItems: "center" },
    filterChip:        { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: "rgba(21,98,42,0.07)", borderWidth: 1.5, borderColor: "rgba(21,98,42,0.18)" },
    filterChipActive:  { backgroundColor: GREEN, borderColor: GREEN, shadowColor: GREEN, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 4 },
    filterChipText:    { fontSize: 12, color: GREEN, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 },
    filterChipTextActive: { color: "#FFFFFF", fontWeight: "900" },
    list:              { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 110, paddingTop: 4 },
    loadingContainer:  { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 90, gap: 10 },
    loadingText:       { fontSize: 13, color: theme.textMuted, fontWeight: "600" },
    card:              { flexDirection: "row", marginBottom: 14, borderRadius: 12, backgroundColor: theme.card, overflow: "hidden", padding: 10, borderWidth: 1.5, borderColor: theme.divider },
    cardPressed:       { opacity: 0.85 },
    cardImageWrap:     { width: 96, height: 112, borderRadius: 12, overflow: "hidden", backgroundColor: theme.iconBg, position: "relative" },
    productImage:      { width: "100%", height: "100%" },
    flagBadge:         { position: "absolute", top: 6, left: 6, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
    flagBadgeText:     { fontSize: 12 },
    favoriteOverlay:   { position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.35)" },
    cardContent:       { flex: 1, marginLeft: 12, paddingVertical: 2, justifyContent: "space-between" },
    cardHeader:        { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
    productName:       { flex: 1, fontSize: 14, fontWeight: "800", color: theme.textPrimary },
    productPrice:      { fontSize: 13, fontWeight: "900" },
    productDescription:{ marginTop: 3, fontSize: 11, lineHeight: 15, color: theme.textMuted },
    stockRow:          { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 7 },
    stockTrack:        { flex: 1, height: 4, borderRadius: 2, backgroundColor: theme.divider, overflow: "hidden" },
    stockFill:         { height: "100%", borderRadius: 2 },
    stockLabel:        { fontSize: 9, fontWeight: "800" },
    cardFooter:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: 6 },
    addToCartBtn:      { width: 30, height: 30, alignItems: "center", justifyContent: "center", backgroundColor: GREEN, borderRadius: 8 },
    secondaryActions:  { flexDirection: "row", gap: 6, marginLeft: "auto" },
    iconButton:        { width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: theme.iconBg },
    deleteIconButton:  { backgroundColor: theme.iconDestructiveBg },
    emptyState:        { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 12 },
    emptyTitle:        { fontSize: 20, fontWeight: "800", color: theme.titlePrimary },
    emptyDesc:         { fontSize: 13, color: theme.textMuted, textAlign: "center", maxWidth: 240 },
    bottomNav:         { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", backgroundColor: theme.card, paddingTop: 12, paddingBottom: 26, paddingHorizontal: 10, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: theme.divider },
    navItem:           { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
    navItemCenter:     { marginTop: -16 },
    navIconWrap:       { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    navIconWrapActive: { backgroundColor: theme.iconBg },
    navCreateBtn:      { width: 52, height: 52, borderRadius: 12, backgroundColor: GOLD, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: theme.card, shadowColor: GOLD, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 6 },
    navLabel:          { fontSize: 10, color: theme.navInactive, fontWeight: "600" },
    navLabelActive:    { color: GREEN, fontWeight: "800" },
    cartBadge:         { position: "absolute", top: -4, right: -8, backgroundColor: RED_LIVE, borderRadius: 10, minWidth: 16, height: 16, justifyContent: "center", alignItems: "center", paddingHorizontal: 4, borderWidth: 1.5, borderColor: theme.card },
    cartBadgeText:     { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  });