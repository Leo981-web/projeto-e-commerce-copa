import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  InteractionManager,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import { formatCurrency } from "../../services/formatters";
import { useTheme } from "../../context/ThemeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const EDGE_BUFFER = 26;
const SVG_WIDTH = SCREEN_WIDTH + EDGE_BUFFER * 2;
const MAX_AMPLITUDE = 95;
const WAVE_TRAVEL = SCREEN_HEIGHT + MAX_AMPLITUDE * 2;

const FLUID_EASING = Easing.bezier(0.22, 1, 0.36, 1);

const GREEN_DARK = "#0E3D1B";
const GREEN_MID = "#15622A";
const GOLD = "#F5C518";

function buildWavePath(flatHeight, amplitude) {
  return `M0,0 H${SVG_WIDTH} V${flatHeight} C${SVG_WIDTH * 0.78},${
    flatHeight + amplitude
  } ${SVG_WIDTH * 0.22},${flatHeight - amplitude} 0,${flatHeight} Z`;
}

function buildWaveTransform(progress) {
  return [
    {
      translateY: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, WAVE_TRAVEL],
      }),
    },
    {
      translateX: progress.interpolate({
        inputRange: [0, 0.2, 0.45, 0.7, 1],
        outputRange: [0, 12, -9, 6, 0],
      }),
    },
  ];
}

const PAYMENT_LABELS = {
  pix: "Pix",
  card: "Cartão de Crédito",
  boleto: "Boleto",
};

function formatOrderDate(isoDate) {
  const date = isoDate ? new Date(isoDate) : new Date();
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReceiptScreen({ route, navigation }) {
  const { theme, isDarkMode } = useTheme();
  const styles = makeStyles(theme, isDarkMode);

  const {
    items = [],
    total = 0,
    paymentMethod = "pix",
    orderId,
    date,
    note,
  } = route?.params || {};

  const paymentLabel = PAYMENT_LABELS[paymentMethod] || "Pagamento";

  const waveBack = useRef(new Animated.Value(0)).current;
  const waveMid = useRef(new Animated.Value(0)).current;
  const waveFront = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      Animated.sequence([
        Animated.delay(180),
        Animated.stagger(180, [
          Animated.timing(waveBack, {
            toValue: 1,
            duration: 1150,
            easing: FLUID_EASING,
            useNativeDriver: true,
          }),
          Animated.timing(waveMid, {
            toValue: 1,
            duration: 1050,
            easing: FLUID_EASING,
            useNativeDriver: true,
          }),
          Animated.timing(waveFront, {
            toValue: 1,
            duration: 950,
            easing: FLUID_EASING,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });

    return () => task.cancel();
  }, [waveBack, waveMid, waveFront]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.heroIcon}>
          <Ionicons name="checkmark-circle" size={64} color={theme.navActive} />
        </View>

        <AppText variant="title" style={styles.heroTitle}>
          Compra confirmada!
        </AppText>
        <AppText variant="muted" style={styles.heroSubtitle}>
          Aqui está o comprovante do seu pedido.
        </AppText>

        {note ? (
          <View style={styles.noteBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={theme.navActive}
            />
            <AppText style={styles.noteText}>{note}</AppText>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.row}>
            <AppText variant="muted">Pedido</AppText>
            <AppText style={styles.value}>#{orderId}</AppText>
          </View>
          <View style={styles.row}>
            <AppText variant="muted">Data</AppText>
            <AppText style={styles.value}>{formatOrderDate(date)}</AppText>
          </View>
          <View style={styles.row}>
            <AppText variant="muted">Forma de pagamento</AppText>
            <AppText style={styles.value}>{paymentLabel}</AppText>
          </View>
        </View>

        <AppText variant="label" style={styles.sectionTitle}>
          Itens comprados
        </AppText>

        <View style={styles.card}>
          {items.map((item, index) => (
            <View
              key={item.id ?? index}
              style={[
                styles.itemRow,
                index === items.length - 1 && styles.itemRowLast,
              ]}
            >
              <View style={styles.itemInfo}>
                <AppText numberOfLines={1} style={styles.itemName}>
                  {item.name}
                </AppText>
                <AppText variant="muted" style={styles.itemQty}>
                  {item.cartQuantity || 1} x {formatCurrency(item.price)}
                </AppText>
              </View>
              <AppText style={styles.itemSubtotal}>
                {formatCurrency(item.price * (item.cartQuantity || 1))}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.totalCard}>
          <AppText style={styles.totalLabel}>Total pago</AppText>
          <AppText style={styles.totalValue}>{formatCurrency(total)}</AppText>
        </View>

        <View style={styles.buttonWrapper}>
          <AppButton
            icon="home"
            title="VOLTAR AO INÍCIO"
            onPress={() => navigation.popToTop()}
            style={{ backgroundColor: GREEN_MID }}
          />
        </View>
      </ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[styles.waveLayer, { transform: buildWaveTransform(waveBack) }]}
      >
        <Svg width={SVG_WIDTH} height={SCREEN_HEIGHT + MAX_AMPLITUDE}>
          <Path d={buildWavePath(SCREEN_HEIGHT - 10, 55)} fill={GREEN_DARK} />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.waveLayer, { transform: buildWaveTransform(waveMid) }]}
      >
        <Svg width={SVG_WIDTH} height={SCREEN_HEIGHT + MAX_AMPLITUDE}>
          <Path d={buildWavePath(SCREEN_HEIGHT - 45, 75)} fill={GREEN_MID} />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.waveLayer, { transform: buildWaveTransform(waveFront) }]}
      >
        <Svg width={SVG_WIDTH} height={SCREEN_HEIGHT + MAX_AMPLITUDE}>
          <Path
            d={buildWavePath(SCREEN_HEIGHT - 80, MAX_AMPLITUDE)}
            fill={GOLD}
          />
        </Svg>
      </Animated.View>
    </SafeAreaView>
  );
}

const makeStyles = (theme, isDarkMode) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    waveLayer: {
      position: "absolute",
      top: 0,
      left: -EDGE_BUFFER,
    },
    scrollContainer: {
      padding: 16,
      paddingTop: 32,
    },
    heroIcon: {
      alignItems: "center",
      marginBottom: 8,
    },
    heroTitle: {
      textAlign: "center",
      color: theme.titlePrimary,
      fontSize: 22,
      marginBottom: 4,
    },
    heroSubtitle: {
      textAlign: "center",
      marginBottom: 24,
      color: theme.textMuted,
    },
    noteBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      backgroundColor: theme.iconBg,
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
    },
    noteText: {
      flex: 1,
      color: theme.titlePrimary,
      fontSize: 13,
      lineHeight: 18,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.25 : 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
    },
    value: {
      fontWeight: "700",
      color: theme.titlePrimary,
    },
    sectionTitle: {
      marginBottom: 10,
      color: theme.titlePrimary,
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    itemRowLast: {
      borderBottomWidth: 0,
      paddingBottom: 0,
    },
    itemInfo: {
      flex: 1,
      marginRight: 12,
    },
    itemName: {
      fontWeight: "600",
      color: theme.titlePrimary,
    },
    itemQty: {
      marginTop: 2,
      fontSize: 13,
      color: theme.textMuted,
    },
    itemSubtotal: {
      fontWeight: "700",
      color: theme.titlePrimary,
    },
    totalCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      marginBottom: 24,
      borderLeftWidth: 5,
      borderLeftColor: theme.navActive,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textMuted,
      textTransform: "uppercase",
    },
    totalValue: {
      fontSize: 32,
      fontWeight: "900",
      color: theme.titlePrimary,
      marginTop: 4,
    },
    buttonWrapper: {
      width: "100%",
    },
  });
